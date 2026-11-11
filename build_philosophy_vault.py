import json
import os
import random
import time
import requests

# OpenRouter API Configuration (load from .env.local like other scripts)
def load_env():
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env.local")
    if not os.path.exists(env_path):
        return
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            match = line.strip()
            if not match or match.startswith("#") or "=" not in match:
                continue
            key, _, val = match.partition("=")
            key = key.strip()
            val = val.strip()
            if (val.startswith('"') and val.endswith('"')) or (
                val.startswith("'") and val.endswith("'")
            ):
                val = val[1:-1]
            os.environ[key] = val


load_env()

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise SystemExit("ERROR: OPENROUTER_API_KEY is missing in .env.local")

API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Broken down by historical ages to prevent model confusion
ERA_CHUNKS = [
    {
        "age": "Classical Antiquity (Greece)",
        "philosophers": "Plato, Aristotle, Heraclitus, Parmenides, Democritus, Epicurus",
        "target": 200
    },
    {
        "age": "Hellenistic & Roman Period (Stoics & Skeptics)",
        "philosophers": "Marcus Aurelius, Seneca, Epictetus, Cicero, Lucretius, Sextus Empiricus",
        "target": 250
    },
    {
        "age": "Eastern Classical & Taoist Tradition",
        "philosophers": "Lao Tzu, Zhuangzi, Confucius, Mencius, Nagarjuna",
        "target": 200
    },
    {
        "age": "The Enlightenment & Rationalism (17th-18th Century)",
        "philosophers": "Baruch Spinoza, Blaise Pascal, René Descartes, David Hume, Voltaire",
        "target": 150
    },
    {
        "age": "19th Century Existentialism, Pessimism & Will",
        "philosophers": "Arthur Schopenhauer, Friedrich Nietzsche, Søren Kierkegaard, Max Stirner",
        "target": 200
    }
]

# Strict system prompt with root object wrapper for OpenAI's JSON mode compliance
STRICT_SYSTEM_PROMPT = """
You are a rigorous philosophical archivist and historian. Your task is to generate a JSON object containing a verified array of authentic philosophical quotes for the specified historical age.

CRITICAL GUARDRAILS:
1. 100% HISTORICAL ACCURACY: The quote must be the exact, verified historical wording from a documented text, letter, or discourse. No paraphrasing, no AI invention.
2. NO CLICHE OVERKILL: Dig deeper into their complete works, letters, essays, and fragments rather than just recycling the top 5 internet quotes.
3. MODERN SANITY CHECK: Provide a sharp, cynical, yet grounding 1-2 sentence modern translation explaining what this means for someone dealing with modern daily chaos.
4. Output MUST be valid JSON matching this exact structure wrapper only:
{
  "quotes": [
    {
      "id": "unique_slug_01",
      "author": "Author Name",
      "source": "Exact Book or Letter Title",
      "quote": "Exact historical text here.",
      "modern_sanity_check": "Your cynical modern translation here."
    }
  ]
}
"""

def call_openrouter(prompt_text):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "Philosophy Vault 1000 Engine"
    }
    
    payload = {
        "model": "openai/gpt-4o",
        "messages": [
            {"role": "system", "content": STRICT_SYSTEM_PROMPT},
            {"role": "user", "content": prompt_text}
        ],
        "temperature": 0.4,
        "response_format": { "type": "json_object" }
    }

    response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
    if response.status_code == 200:
        data = response.json()
        content = data['choices'][0]['message']['content']
        parsed = json.loads(content)
        
        # Safely extract the array from the root object wrapper
        if isinstance(parsed, dict):
            for key, value in parsed.items():
                if isinstance(value, list):
                    return value
            raise Exception(f"Parsed dict keys did not contain a list: {list(parsed.keys())}")
        elif isinstance(parsed, list):
            return parsed
        else:
            raise Exception("Unexpected JSON root type received.")
    else:
        raise Exception(f"API Error [{response.status_code}]: {response.text}")

def build_vault():
    master_vault = []
    batch_size = 50  # Safe chunk size to avoid token cutoff

    print("--- STARTING PHILOSOPHY VAULT GENERATION (TARGET: ~1000) ---")

    for era in ERA_CHUNKS:
        age_name = era["age"]
        philosophers = era["philosophers"]
        total_target = era["target"]
        generated_for_age = 0

        print(f"\n[Age]: {age_name} (Target: {total_target})")

        while generated_for_age < total_target:
            current_batch = min(batch_size, total_target - generated_for_age)
            prompt = (
                f"Generate a JSON object containing an array of exactly {current_batch} deep, verified quotes "
                f"from this historical age: {age_name}. Focus primarily on these thinkers: {philosophers}. "
                f"Ensure unique IDs, exact historical sources, and modern sanity checks."
            )

            success = False
            attempts = 0
            while not success and attempts < 3:
                try:
                    print(f" -> Fetching batch of {current_batch} (Attempt {attempts+1})...")
                    quotes_chunk = call_openrouter(prompt)
                    if isinstance(quotes_chunk, list) and len(quotes_chunk) > 0:
                        master_vault.extend(quotes_chunk)
                        generated_for_age += len(quotes_chunk)
                        success = True
                        print(f"    Success! Accumulated {len(quotes_chunk)} quotes. Age progress: {generated_for_age}/{total_target}")
                    else:
                        print("    Warning: Received empty list or invalid format. Retrying...")
                        attempts += 1
                except Exception as e:
                    attempts += 1
                    print(f"    Error encountered: {e}. Retrying in 3 seconds...")
                    time.sleep(3)
            
            time.sleep(2) # Rate limit padding between calls

    print(f"\nRaw generation complete. Total collected: {len(master_vault)} quotes.")

    # Script-side RNG Shuffling
    print("Shuffling vault entries using system RNG...")
    random.shuffle(master_vault)

    # Final Output Save
    output_filename = "philosophy_vault_1000.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        json.dump(master_vault, f, indent=2, ensure_ascii=False)

    print(f"Vault successfully compiled, shuffled, and saved locally to '{output_filename}'!")

if __name__ == "__main__":
    build_vault()
