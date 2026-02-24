from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    
    # Take screenshot of initial load
    page.screenshot(path='initial_load.png', full_page=True)
    
    # Try to add an "aviso" on Monday
    # Find all 'Añadir Horas' buttons, index 0 is Monday
    add_buttons = page.locator('button:has-text("Añadir Horas")').all()
    if add_buttons:
        print(f"Found {len(add_buttons)} add buttons")
        
        # the inputs are preceding the button.
        # let's just use page.locator to find inputs.
        # Since it's a grid of days, let's target Monday's card specifically
        monday_card = page.locator('.glass-card').nth(0)
        
        start_input = monday_card.locator('input[type="time"]').nth(0)
        end_input = monday_card.locator('input[type="time"]').nth(1)
        
        start_input.fill('08:00')
        end_input.fill('10:30')
        
        monday_card.locator('button:has-text("Añadir Horas")').click()
        
        page.wait_for_timeout(500)
        
        page.screenshot(path='after_add.png', full_page=True)
        print("Successfully added aviso. Screenshot taken.")
        
    else:
        print("Could not find Add Avisos button")
        
    browser.close()
