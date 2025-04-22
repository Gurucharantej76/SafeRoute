from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load your trained model
with open('kmeans_model.pkl', 'rb') as f:
    kmeans = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    cluster = kmeans.predict(features)
    return jsonify({'cluster': int(cluster[0])})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
