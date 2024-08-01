import os

# Get list of files in the current directory
file_list = os.listdir('.')

# Write the list to list.txt
with open('list.txt', 'w') as file:
    for f in file_list:
        file.write(f + '\n')

print("File list has been written to list.txt")
