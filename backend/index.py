from flask import Flask, request, jsonify
import os
import google.generativeai as genai
from flask_cors import CORS
import google.ai.generativelanguage as glm
import tempfile

app = Flask(__name__)
CORS(app)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

generation_config = {
    "candidate_count": 1,
    "temperature": 0.5,
}

safety_settings = {
    'HATE': 'BLOCK_NONE',
    'HARASSMENT': 'BLOCK_NONE',
    'SEXUAL': 'BLOCK_NONE',
    'DANGEROUS': 'BLOCK_NONE'
}

model = genai.GenerativeModel(model_name='gemini-1.5-pro-latest',
                              generation_config=generation_config,
                              safety_settings=safety_settings)


@app.route('/process_audio', methods=['POST'])
def process_audio():
    if 'file' not in request.files:
        return {'error': 'Nenhum arquivo de áudio enviado'}, 400

    audio_file = request.files['file']
    if audio_file.filename.endswith('.wav'):
        text = audio_processing(audio_file)
        print(jsonify({'text': text}))
        return jsonify({'text': text}), 200
    else:
        return {'error': 'Formato de arquivo não suportado. Apenas arquivos .wav são aceitos'}, 400


def save_temporary_file(audio_file):
    temp_dir = tempfile.gettempdir()
    audio_file_path = os.path.join(temp_dir, 'audio.wav')
    audio_file.save(audio_file_path)
    return audio_file_path


def audio_processing(audio_file):
    prompt = str('Com base no audio enviado, retorne uma as informações de status,humor, descricao e acoes que um terceiro pode tomar,',
                 'separadas por ##. considere status possiveis = "em andamento, finalizada, stand by", considere humor como ="violento,',
                 'brando, ou clima tenso" e considere ações como ações que possam ser tomadas para manter a segurança das pessoas envolvidas',
                 'no corrida. exemplo1: ##status="finalizado"##humor="brando"##descricao="a corrida finalizou rapidamente sem problemas"##acoes="nenhuma',
                 'exemplo1: ##status="em andamento"##humor="violento"##descricao="ha indicios de um assalto"##acoes="ligar para a policia"')
    history = [{
        "role": "user",
                "parts": [genai.upload_file(save_temporary_file(audio_file))]
    }]
    convo = model.start_chat(history=history)
    response = convo.send_message(prompt)
    return response.text


if __name__ == '__main__':
    app.run(debug=True)
