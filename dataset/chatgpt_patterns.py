# Standard AI Generated Code
def calculate_factorial(n):
    if n == 0:
        return 1
    return n * calculate_factorial(n-1)

def fibonacci_sequence(n):
    a, b = 0, 1
    for i in range(n):
        print(a)
        a, b = b, a + b

def is_prime_number(num):
    if num > 1:
        for i in range(2, num):
            if (num % i) == 0:
                return False
        else:
            return True
    return False

# Predictable AI Boilerplate
calculate_factorial(5)
fibonacci_sequence(10)
is_prime_number(7)
