from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from docx import Document
import requests  # Import requests to make HTTP requests to the Whisper API
import io
import traceback
from logger_config import setup_logger
from form_data_processor import process_form_data

# Set up logger
logger = setup_logger('app', '/mnt/c/Users/user/Desktop/Coding/coast/report_scanner/misc/logs/app.log')

# Flask app setup
app = Flask(__name__)
CORS(app)  
app.config['SECRET_KEY'] = 'dev_key'
app.config['TEMPLATE_PATH'] = '/mnt/c/Users/user/Desktop/Coding/coast/report_scanner/misc/templates/test-report-template.docx'
# Whisper API Configuration
WHISPER_API_URL = "https://transcribe.whisperapi.com"
WHISPER_API_KEY = "LNJXU3M7TYXYX8219W7X65DZ4XIR3I7Z"


@app.route('/transcribe_audio', methods=['POST'])
def transcribe_audio():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Prepare the data for Whisper API
    headers = {'Authorization': f'Bearer {WHISPER_API_KEY}'}
    files = {'file': file}
    data = {
        "fileType": "wav",  # Modify as needed
        "language": "en",
        "task": "transcribe",
        # Add other parameters as needed
    }

    response = requests.post(WHISPER_API_URL, headers=headers, files=files, data=data)

    # Check response status and handle errors
    if response.status_code == 200:
        # Assuming the Whisper API returns JSON with a transcription field
        text = response.text
        print(text)  # Log for debugging
        return text
    else:
        # Log error details
        print(f"Error from Whisper API: {response.status_code}, {response.text}")
        return jsonify({"error": "Failed to transcribe audio", "details": response.text}), response.status_code


@app.route('/generate-document', methods=['POST'])
def generate_document():
    try:
        data = request.json.get('forms')
        logger.info("Received form data: %s", data)
        combined_document = Document()

        for form_data in data:
            doc = Document(app.config['TEMPLATE_PATH'])
            processed_doc = process_form_data(doc, form_data)

            if processed_doc is None:
                logger.error("Processing of form data returned None.")
                return "Error in processing form data.", 500

            # Append document content to combined document
            for element in processed_doc.element.body:
                combined_document.element.body.append(element)
            combined_document.add_page_break()

        # Save the combined document to a byte stream
        output_stream = io.BytesIO()
        combined_document.save(output_stream)
        output_stream.seek(0)

        # Set the correct headers for file download
        response = Response(output_stream.getvalue(), mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        response.headers["Content-Disposition"] = "attachment; filename=combined_forms.docx"
        return response
    except Exception as e:
        print(f"Error in generate_document function: {e}")
        traceback.print_exc()
        return f"An error occurred: {e}", 500


# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
