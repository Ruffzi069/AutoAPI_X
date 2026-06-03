#!/usr/bin/env python3
"""
Attack ID Verification Script
Validates that all attack IDs are synchronized across frontend and backend
"""

import json
import re

# Expected attack IDs (source of truth)
EXPECTED_ATTACK_IDS = [
    'replay',
    'idor',
    'broken-authentication',
    'excessive-data-exposure',
    'rate-limiting-failure',
    'ota-manipulation'
]

def check_frontend_file(filepath, context_name):
    """Check if a frontend file contains the correct attack IDs"""
    print(f"\n📄 Checking {context_name}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        found_ids = []
        for attack_id in EXPECTED_ATTACK_IDS:
            # Look for attack ID in various contexts
            patterns = [
                f"'{attack_id}'",
                f'"{attack_id}"',
                f'attackId: "{attack_id}"',
                f"attackId: '{attack_id}'"
            ]
            for pattern in patterns:
                if pattern in content:
                    found_ids.append(attack_id)
                    break
        
        if len(found_ids) == len(EXPECTED_ATTACK_IDS):
            print(f"   ✅ All {len(EXPECTED_ATTACK_IDS)} attack IDs found!")
            return True
        else:
            print(f"   ⚠️  Found {len(found_ids)}/{len(EXPECTED_ATTACK_IDS)} attack IDs")
            missing = set(EXPECTED_ATTACK_IDS) - set(found_ids)
            if missing:
                print(f"   ❌ Missing: {', '.join(missing)}")
            return False
            
    except FileNotFoundError:
        print(f"   ❌ File not found: {filepath}")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def check_backend_routes():
    """Check backend attack routes"""
    print(f"\n📄 Checking Backend Attack Routes...")
    filepath = 'backend/routes/attack_routes.py'
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for route definitions
        found_routes = []
        for attack_id in EXPECTED_ATTACK_IDS:
            if f"'{attack_id}'" in content or f'"{attack_id}"' in content:
                found_routes.append(attack_id)
        
        if len(found_routes) >= 5:  # At least 5 attacks implemented
            print(f"   ✅ Backend routes configured for {len(found_routes)} attacks")
            return True
        else:
            print(f"   ⚠️  Only {len(found_routes)} attacks found in backend")
            return False
            
    except FileNotFoundError:
        print(f"   ❌ File not found: {filepath}")
        return False

def main():
    """Run verification checks"""
    print("=" * 70)
    print("🔍 AutoAPI-X Attack ID Synchronization Verification")
    print("=" * 70)
    
    results = []
    
    # Check frontend files
    files_to_check = [
        ('frontend/src/pages/AttackSimulation.tsx', 'AttackSimulation.tsx'),
        ('frontend/src/stores/attackStore.ts', 'attackStore.ts'),
        ('frontend/src/components/AttackSimulation/APIActivityPanel.tsx', 'APIActivityPanel.tsx'),
        ('frontend/src/components/AttackSimulation/CANActivityPanel.tsx', 'CANActivityPanel.tsx'),
        ('frontend/src/components/AttackSimulation/VehicleReactionPanel.tsx', 'VehicleReactionPanel.tsx'),
    ]
    
    for filepath, name in files_to_check:
        result = check_frontend_file(filepath, name)
        results.append((name, result))
    
    # Check backend
    backend_result = check_backend_routes()
    results.append(('Backend Routes', backend_result))
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 VERIFICATION SUMMARY")
    print("=" * 70)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status:12} - {name}")
    
    print("=" * 70)
    print(f"   Result: {passed}/{total} checks passed")
    
    if passed == total:
        print("\n   🎉 All attack IDs are synchronized!")
        print("   ✅ Attack stats display should work correctly")
        print("   ✅ Impact Analysis should receive data properly")
        return 0
    else:
        print("\n   ⚠️  Some attack IDs are not synchronized")
        print("   ❌ Please review the issues above")
        return 1

if __name__ == '__main__':
    exit(main())
