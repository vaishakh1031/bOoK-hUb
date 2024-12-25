import requests

def display_menu():
    print("1. Add a Book")
    print("2. Search for a Book")
    print("3. Borrow a Book")
    print("4. Return a Book")
    print("5. Exit")

def add_book():
    title = input("Enter book title: ")
    author = input("Enter book author: ")
    isbn = input("Enter book ISBN: ")
    payload = {"title": title, "author": author, "isbn": isbn}
    response = requests.post("http://127.0.0.1:5000/add_book", json=payload)
    if response.status_code == 201:
        print("Book added successfully.")
    else:
        print("Error adding book:", response.json().get("error"))

def search_book():
    query = input("Enter title, author, or ISBN to search: ")
    response = requests.get(f"http://127.0.0.1:5000/search_book?query={query}")
    if response.status_code == 200:
        books = response.json()
        if books:
            for book in books:
                print(f"ID: {book['b_no']}, Title: {book['b_title']}, Author: {book['b_author']}, ISBN: {book['b_isbn']}, Borrower: {book.get('borrower', 'None')}")
        else:
            print("No books found.")
    else:
        print("Error searching books:", response.json().get("error"))

def borrow_book():
    book_id = input("Enter book ID to borrow: ")
    borrower = input("Enter your name: ")
    payload = {"b_no": book_id, "borrower": borrower}
    response = requests.post("http://127.0.0.1:5000/borrow_book", json=payload)
    if response.status_code == 200:
        print("Book borrowed successfully.")
    else:
        print("Error borrowing book:", response.json().get("error"))

def return_book():
    book_id = input("Enter book ID to return: ")
    payload = {"b_no": book_id}
    response = requests.post("http://127.0.0.1:5000/return_book", json=payload)
    if response.status_code == 200:
        print("Book returned successfully.")
    else:
        print("Error returning book:", response.json().get("error"))

def main():
    while True:
        display_menu()
        choice = input("Enter your choice: ")
        if choice == "1":
            add_book()
        elif choice == "2":
            search_book()
        elif choice == "3":
            borrow_book()
        elif choice == "4":
            return_book()
        elif choice == "5":
            print("Exiting...")
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main()
