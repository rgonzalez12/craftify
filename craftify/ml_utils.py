import torch
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pth')

from torchvision import models
model = models.resnet18(pretrained=False)
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, 2)

model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
model.eval()

def run_inference(input_tensor):
    with torch.no_grad():
        output = model(input_tensor)
        _, predicted = torch.max(output, 1)
        return predicted.item()