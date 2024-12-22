from book import add_book, search_book, borrow_book, return_book, check_overdue

def main_menu():
    """Displays the main menu."""
    while True:
        print("1. Add a Book")
        print("2. Search for a Book")
        print("3. Borrow a Book")
        print("4. Return a Book")
        print("5. Check Overdue Notifications")
        print("6. Exit")
        choice = int(input("Enter your choice: "))

        if choice == 1:
            title = input("Enter book title: ")
            author = input("Enter book author: ")
            isbn = input("Enter book ISBN: ")
            add_book(title, author, isbn)
        elif choice == 2:
            search_term = input("Enter title, author, or ISBN to search: ")
            results = search_book(search_term)
            for result in results:
                print(result)
        elif choice == 3:
            b_no = int(input("Enter book ID to borrow: "))
            borrower_name = input("Enter your name: ")
            borrow_book(b_no, borrower_name)
        elif choice == 4:
            b_no = int(input("Enter book ID to return: "))
            return_book(b_no)
        elif choice == 5:
            check_overdue()
        elif choice == 6:
            print("Exiting...")
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main_menu()