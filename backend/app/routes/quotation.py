from flask import Blueprint, request, jsonify
from flask_mail import Message
from app.extensions import mail
import base64

quotation_bp = Blueprint('quotation', __name__)

@quotation_bp.route('/send-quotation', methods=['POST'])
def send_quotation():
    data = request.json
    recipient = data.get('email')
    pdf_base64 = data.get('pdf')  # base64-encoded PDF from frontend

    if not recipient or not pdf_base64:
        return jsonify({"error": "Missing email or PDF data"}), 400

    try:
        msg = Message("Quotation Document",
                      sender="muriuki.victor@gmail.com",  # set via MAIL_USERNAME
                      recipients=[recipient])
        msg.body = "Attached is the quotation you requested."

        # Decode and attach the PDF
        pdf_data = base64.b64decode(pdf_base64.split(',')[1])  # remove header
        msg.attach("quotation.pdf", "application/pdf", pdf_data)

        mail.send(msg)
        return jsonify({"message": "Quotation sent successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
