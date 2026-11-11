import json
import os

def clean_and_merge_vault(master_filename, new_batch_filename):
    # Load existing master vault if it exists
    if os.path.exists(master_filename):
        with open(master_filename, "r", encoding="utf-8") as f:
            master_vault = json.load(f)
    else:
        master_vault = []

    # Load the new batch
    if not os.path.exists(new_batch_filename):
        print(f"Error: Batch file '{new_batch_filename}' not found.")
        return

    with open(new_batch_filename, "r", encoding="utf-8") as f:
        new_batch = json.load(f)

    # Track existing quotes and IDs to prevent collisions
    seen_quotes = {item["quote"].strip() for item in master_vault}
    seen_ids = {item["id"] for item in master_vault}

    added_count = 0
    duplicate_count = 0

    for item in new_batch:
        q_text = item.get("quote", "").strip()
        q_id = item.get("id", "").strip()

        # Skip empty entries or exact duplicates
        if not q_text or q_text in seen_quotes or q_id in seen_ids:
            duplicate_count += 1
            continue

        seen_quotes.add(q_text)
        seen_ids.add(q_id)
        master_vault.append(item)
        added_count += 1

    # Save back to master vault
    with open(master_filename, "w", encoding="utf-8") as f:
        json.dump(master_vault, f, indent=2, ensure_ascii=False)

    print(f"--- Vault Update Complete ---")
    print(f"Added: {added_count} new unique quotes.")
    print(f"Rejected: {duplicate_count} duplicates/collisions.")
    print(f"Total Master Vault Size: {len(master_vault)} / 3000")

if __name__ == "__main__":
    # Change filenames as needed when you drop new batches
    master_file = "philosophy_vault_master.json"
    incoming_file = "new_batch.json"
    clean_and_merge_vault(master_file, incoming_file)
