from flask import Flask, render_template, request
import pandas as pd
import joblib

app = Flask(__name__)
model = joblib.load(r"C:\Users\chara\OneDrive\Desktop\HACHIMAN\final project\Intelligent Customer Retention Assistant Using Explainable\models\random_forest_model_1.pkl")
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/predict", methods=["GET", "POST"])
def predict():
    if request.method == "POST":
        data = pd.DataFrame([{
            'CIBIL_Score': int(request.form['CIBIL_Score']),
            'Age': int(request.form['Age']),
            'Tenure': int(request.form['Tenure']),
            'Account_Balance': float(request.form['Account_Balance']),
            'NumOfProducts': int(request.form['NumOfProducts']),
            'HasCrCard': int(request.form['HasCrCard']),
            'Digital_Active': int(request.form['Digital_Active']),
            'Monthly_Income': float(request.form['Monthly_Income']),
            'Geography': request.form['Geography'],
            'Gender': request.form['Gender']
        }])

        churn = model.predict(data)[0]
        prob = model.predict_proba(data)[0][1]

        # Retention logic
        if churn == 1:
            retention = "Offer cashback, reduce charges, and assign relationship manager"
        else:
            retention = "Customer is stable. Upsell premium products"

        return render_template(
            "result.html",
            churn=churn,
            probability=round(prob * 100, 2),
            retention=retention
        )
        return render_template(
        "result.html",
        churn=churn,
        probability=probability,
        retention=retention
    )
    return render_template("predict.html")
import sqlite3


def save_chat(user, message, sender):
    conn = sqlite3.connect("chat_history.db")
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            sender TEXT,
            message TEXT
        )
    """)
    cur.execute("INSERT INTO chats (user, sender, message) VALUES (?, ?, ?)",
                (user, sender, message))
    conn.commit()
    conn.close()
@app.route('/loan-chatbot')
def loan_chatbot():
    return render_template('loan_chatbot.html')
def get_retention_recommendation(churn, probability, cibil_score, age, balance):
    recommendations = []

    if churn == 1:
        recommendations.append("📞 Assign a dedicated relationship manager")

        if probability > 70:
            recommendations.append("🎁 Offer loyalty rewards or cashback")

        if cibil_score < 650:
            recommendations.append("📊 Provide credit score improvement guidance")

        if balance < 50000:
            recommendations.append("💰 Offer minimum balance relaxation")

        if age < 30:
            recommendations.append("📱 Promote mobile banking & digital offers")

        if age >= 60:
            recommendations.append("🛡 Offer senior citizen banking benefits")

    else:
        recommendations.append("✅ Customer is stable — continue engagement programs")

    return recommendations




if __name__ == "__main__":
    app.run(debug=True)
