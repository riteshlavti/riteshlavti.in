import os
import subprocess
import sys

def setup_backend():
    print("Setting up backend environment...")
    
    # Create virtual environment if it doesn't exist
    if not os.path.exists('venv'):
        print("Creating virtual environment...")
        subprocess.run([sys.executable, '-m', 'venv', 'venv'])
    
    # Determine the pip path based on the operating system
    if os.name == 'nt':  # Windows
        pip_path = os.path.join('venv', 'Scripts', 'pip')
    else:  # Unix/Linux/MacOS
        pip_path = os.path.join('venv', 'bin', 'pip')
    
    # Install requirements
    print("Installing requirements...")
    subprocess.run([pip_path, 'install', '-r', 'requirements.txt'])
    
    # Create .env file if it doesn't exist
    if not os.path.exists('.env'):
        print("Creating .env file...")
        with open('.env', 'w') as f:
            f.write("""ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin User
JWT_SECRET=your-secret-key-here
""")
    
    # Run the admin creation script
    print("Creating admin user...")
    if os.name == 'nt':  # Windows
        python_path = os.path.join('venv', 'Scripts', 'python')
    else:  # Unix/Linux/MacOS
        python_path = os.path.join('venv', 'bin', 'python')
    
    subprocess.run([python_path, 'scripts/create_admin.py'])
    
    print("\nBackend setup complete!")
    print("\nTo start the backend server:")
    if os.name == 'nt':  # Windows
        print("venv\\Scripts\\uvicorn app:app --reload")
    else:  # Unix/Linux/MacOS
        print("venv/bin/uvicorn app:app --reload")

if __name__ == "__main__":
    setup_backend() 