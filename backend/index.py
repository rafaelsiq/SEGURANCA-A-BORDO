from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import google.generativeai as genai
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
@cross_origin()
def process_audio():
    if 'file' not in request.files:
        return {'error': 'Nenhum arquivo de áudio enviado'}, 400

    audio_file = request.files['file']
    if audio_file.filename.endswith('.wav'):
        text = audio_processing(audio_file)
        response = jsonify({'text': text}), 200
        return response
    else:
        return {'error': 'Formato de arquivo não suportado. Apenas arquivos .wav são aceitos'}, 400


def save_temporary_file(audio_file):
    temp_dir = tempfile.gettempdir()
    audio_file_path = os.path.join(temp_dir, 'audio.wav')
    audio_file.save(audio_file_path)
    return audio_file_path


def audio_processing(audio_file):
    prompt = str('input: audio'
                 'Informações Gerais:'
                 'Status: (em andamento, finalizada)'
                 'Humor: (Neutro, Agitado, Deprimido,  Entusiasmado, Com medo, Zangado)'
                 'Descrição: Breve resumo do que está acontecendo no áudio.'
                 'Ações: Sugestões curtas de ações que podem ser tomadas para manter a segurança das pessoas envolvidas.'
                 'policia: Informa uma boolean que será true, caso seja necessario contactar a policia'
                 'Exemplos de output:'
                 '##Status="finalizado"##Humor="brando"##Descrição="A corrida finalizou rapidamente sem problemas"##Ações="Nenhuma"##Polícia="false"'
                 '##Status="em andamento"##Humor="violento"##Descrição="Há indícios de um assalto"##Ações="Ligar para a polícia"##Polícia="true"')

    convo = model.start_chat(history={
        "role": "user",
                "parts": [genai.upload_file(save_temporary_file(audio_file))]
    })
    response = convo.send_message(prompt)
    return response.text


if __name__ == '__main__':
    app.run(debug=True)
