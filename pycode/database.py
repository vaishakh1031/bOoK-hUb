import mysql.connector

# Establish a connection (replace with your configuration)
def get_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        passwd='Kr1shn@#$_2',
        database='library',
        charset='utf8',
        auth_plugin='mysql_native_password'
    )

def execute_query(query, values=None, fetch=False):
    """Executes a query with optional values."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        if values:
            cursor.execute(query, values)
        else:
            cursor.execute(query)
        if fetch:
            return cursor.fetchall()
        conn.commit()
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()
