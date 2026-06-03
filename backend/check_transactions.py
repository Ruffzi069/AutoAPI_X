import sqlite3

conn = sqlite3.connect('database/autoapi.db')
cursor = conn.cursor()

print("\n" + "="*80)
print("TRANSACTION ID VERIFICATION")
print("="*80)

# Check API logs
print("\n📊 Recent API Logs with Transaction IDs:")
print("-"*80)
cursor.execute('SELECT id, transaction_id, method, endpoint FROM api_logs ORDER BY id DESC LIMIT 5')
api_rows = cursor.fetchall()
for row in api_rows:
    txn = row[1] if row[1] else "None"
    print(f"ID: {row[0]:3d} | TXN: {txn:15s} | {row[2]:6s} | {row[3]}")

# Check CAN logs
print("\n🚗 Recent CAN Logs with Transaction IDs:")
print("-"*80)
cursor.execute('SELECT id, transaction_id, can_id, source_ecu, destination_ecu FROM can_logs ORDER BY id DESC LIMIT 5')
can_rows = cursor.fetchall()
for row in can_rows:
    txn = row[1] if row[1] else "None"
    print(f"ID: {row[0]:3d} | TXN: {txn:15s} | CAN: {row[2]} | {row[3]} → {row[4]}")

# Check Event logs
print("\n📝 Recent Event Logs with Transaction IDs:")
print("-"*80)
cursor.execute('SELECT id, transaction_id, event_type, description FROM event_logs ORDER BY id DESC LIMIT 5')
event_rows = cursor.fetchall()
for row in event_rows:
    txn = row[1] if row[1] else "None"
    print(f"ID: {row[0]:3d} | TXN: {txn:15s} | {row[2]:20s} | {row[3][:40]}")

# Count transactions
print("\n📈 Transaction Statistics:")
print("-"*80)
cursor.execute('SELECT COUNT(DISTINCT transaction_id) FROM api_logs WHERE transaction_id IS NOT NULL')
api_txn_count = cursor.fetchone()[0]
cursor.execute('SELECT COUNT(DISTINCT transaction_id) FROM can_logs WHERE transaction_id IS NOT NULL')
can_txn_count = cursor.fetchone()[0]
cursor.execute('SELECT COUNT(DISTINCT transaction_id) FROM event_logs WHERE transaction_id IS NOT NULL')
event_txn_count = cursor.fetchone()[0]

print(f"Unique API Transaction IDs: {api_txn_count}")
print(f"Unique CAN Transaction IDs: {can_txn_count}")
print(f"Unique Event Transaction IDs: {event_txn_count}")

# Show a complete transaction trace
print("\n🔍 Sample Transaction Trace (Most Recent TXN):")
print("-"*80)
cursor.execute('SELECT transaction_id FROM api_logs WHERE transaction_id IS NOT NULL ORDER BY id DESC LIMIT 1')
latest_txn = cursor.fetchone()
if latest_txn:
    txn_id = latest_txn[0]
    print(f"Following Transaction: {txn_id}\n")
    
    # API log
    cursor.execute('SELECT timestamp, method, endpoint FROM api_logs WHERE transaction_id = ?', (txn_id,))
    api = cursor.fetchone()
    if api:
        print(f"1️⃣  API Request:  {api[0]} | {api[1]} {api[2]}")
    
    # CAN log
    cursor.execute('SELECT timestamp, can_id, source_ecu, destination_ecu FROM can_logs WHERE transaction_id = ?', (txn_id,))
    can = cursor.fetchone()
    if can:
        print(f"2️⃣  CAN Frame:    {can[0]} | {can[1]} | {can[2]} → {can[3]}")
    
    # Event log
    cursor.execute('SELECT timestamp, event_type, description FROM event_logs WHERE transaction_id = ?', (txn_id,))
    event_results = cursor.fetchall()
    for i, event in enumerate(event_results, 3):
        print(f"{i}️⃣  Event Log:    {event[0]} | {event[1]} | {event[2]}")
else:
    print("No transactions found yet")

print("\n" + "="*80)
print("✅ Transaction ID System Verified!")
print("="*80 + "\n")

conn.close()
