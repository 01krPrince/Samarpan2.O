#include <stdio.h>
int main()
{
    int arr[] = {0, 1, 0, 3, 1, 8};
    int n = sizeof(arr) / sizeof(arr[0]);

    for (int i = 0; i < n; i++)
    {
        if (arr[i] == 0)
        {
            for (int j = i + 1; j < n; j++)
            {
                if (arr[j] != 0)
                {
                    int temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
    }

    for (int j = 0; j < n; j++)
    {
        printf("%d  ", arr[j]);
    }
}
