import sys
import json
from gpt4all import GPT4All

# Load model once
model = GPT4All("Meta-Llama-3-8B-Instruct.Q4_0.gguf")

def generate(prompt):
    response = model.generate(prompt, max_tokens=1000)
    return response

if __name__ == "__main__":
    user_input = sys.argv[1]

    prompt = f"""
Return ONLY valid JSON.

Do NOT include:
- <think>
- explanations
- extra text

JSON format:
{{
  "startup_name": "...",
  "problem": "...",
  "solution": "...",
  "target_market": "...",
  "unique_value_proposition": "...",
  "revenue_streams": "...",
  "key_metrics": "...",
  "cost_structure": "...",
  "marketing_strategy": "...",
  "technology_stack": "..."
}}

Idea: {user_input}
"""

    output = generate(prompt)

    print(output.strip())