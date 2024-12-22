import random
from database import execute_query

def add_book(b_title, b_author, b_isbn):
    """Adds a new book to the library."""
    b_no = random.randint(1, 10000)
    query = "INSERT INTO book (b_no, b_title, b_author, b_isbn) VALUES (%s, %s, %s, %s)"
    values = (b_no, b_title, b_author, b_isbn)
    execute_query(query, values)
    print(f"Book added with ID: {b_no}")
    return b_no

def search_book(search_term):
    """Searches for books by title, author, or ISBN."""
    query = "SELECT * FROM book WHERE b_title LIKE %s OR b_author LIKE %s OR b_isbn LIKE %s"
    values = (f"%{search_term}%", f"%{search_term}%", f"%{search_term}%")
    return execute_query(query, values, fetch=True)

def borrow_book(b_no, borrower_name):
    """Marks a book as borrowed by a user."""
    query = "UPDATE book SET borrower = %s WHERE b_no = %s"
    values = (borrower_name, b_no)
    execute_query(query, values)
    print(f"Book with ID {b_no} borrowed by {borrower_name}.")

def return_book(b_no):
    """Marks a book as returned."""
    query = "UPDATE book SET borrower = NULL WHERE b_no = %s"
    values = (b_no,)
    execute_query(query, values)
    print(f"Book with ID {b_no} returned.")

def check_overdue():
    """Checks for overdue books and notifies users."""
    query = "SELECT b_no, b_title, borrower FROM book WHERE due_date < CURDATE() AND borrower IS NOT NULL"
    overdue_books = execute_query(query, fetch=True)
    if overdue_books:
        print(f"You have {len(overdue_books)} overdue book(s):")
        for book in overdue_books:
            print(f"Book ID: {book[0]}, Title: {book[1]}, Borrower: {book[2]}")
    else:
        print("No overdue books.")