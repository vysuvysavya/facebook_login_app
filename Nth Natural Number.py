Given a positive integer n. You have to find nth natural number after removing all the numbers containing the digit 9.

===============================================================
class Solution:
    def findNth(self, n: int) -> int:
        result = 0
        multiplier = 1
        
        # Convert the number to base 9
        while n > 0:
            result += (n % 9) * multiplier  # Get the last digit in base 9
            n //= 9                         # Move to the next digit in base 9
            multiplier *= 10                # Increase place value by 10 (base 10)
        
        return result
Example 1:
Input: n = 8
The first 8 numbers (after excluding those with '9') are: 1, 2, 3, 4, 5, 6, 7, 8.
The 8th number is 8.
Output: 8
Example 2:
Input: n = 9
The first 9 numbers (after excluding those with '9') are: 1, 2, 3, 4, 5, 6, 7, 8, 10.
The 9th number is 10.
Output: 10
