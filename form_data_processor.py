from logger_config import setup_logger
import traceback

logger = setup_logger('form_data_processor', '/mnt/c/Users/user/Desktop/Coding/coast/report_scanner/misc/logs/form_data_processor.log')

def process_form_data(doc, form_data):
    try:
        logger.info("Starting form data processing")
        logger.debug(f"Form data received for processing: {form_data}")
        logger.info(f"Doc: {doc}")

        checkbox_options = {
            'estopActivated': ['manual', 'autonomous', 'na'],
            'missionStatus': ['successfulTermination'],
            'stateAfterTest': ['waitingStation', 'goToStation', 'authorizedDrive'],
            'acceleration': ['satisfactory', 'inadequate', 'na'],
            'braking': ['satisfactory', 'inadequate', 'na'],
            'curves': ['satisfactory', 'inadequate', 'na'],
            'downhill': ['satisfactory', 'inadequate', 'na'],
            'uphill': ['satisfactory', 'inadequate', 'na'],
            'hmi': ['satisfactory', 'inadequate', 'na']
        }
        logger.debug("Checkbox options defined: %s", checkbox_options)
       
        # Helper function to update checkboxes
        def update_checkboxes(paragraph, key, selected_option):
            for option in checkbox_options.get(key, []):
                checkbox_placeholder = f"{{{{{key}_{option}:checked}}}}"
                checkbox_mark = '☑' if option == selected_option else '☐'
                if checkbox_placeholder in paragraph.text:
                    paragraph.text = paragraph.text.replace(checkbox_placeholder, checkbox_mark)
                    logger.debug(f"Updated {key} checkbox for {option} to {checkbox_mark}")

        # Process tables
        for table in doc.tables:
            for row in table.rows:
                for cell in row.cells:
                    for paragraph in cell.paragraphs:
                        for key, value in form_data.items():
                            # Update text replacements
                            placeholder = f'{{{{' + key + '}}}}'
                            if placeholder in paragraph.text:
                                paragraph.text = paragraph.text.replace(placeholder, str(value))
                                logger.debug(f"Replaced placeholder {placeholder} with {value}")

                            # Update checkbox replacements
                            if key in checkbox_options:
                                update_checkboxes(paragraph, key, value)

        logger.info("Form data processing completed")
        return doc
    except Exception as e:
        logger.error("Error processing form data: %s", str(e))
        traceback.print_exc()
        return None
