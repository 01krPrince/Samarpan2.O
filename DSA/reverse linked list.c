#include <stdio.h>
#include <stdlib.h>

struct node {
    int data;
    struct node *next;
};

int main() {
    int n;
    printf("Enter size: ");
    scanf("%d", &n);

    struct node *arr = malloc(n * sizeof(struct node));
    struct node head;
    head.next = NULL;

    printf("Enter elements: ");
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i].data);
        arr[i].next = NULL;

        if (i == 0) {
            head.next = &arr[0];
        } else {
            arr[i - 1].next = &arr[i];
        }
    }

    printf("Before reverse: ");
    struct node *temp = head.next;
    while (temp != NULL) {
        printf("%d  ", temp->data);
        temp = temp->next;
    }

    struct node *prev = NULL;
    struct node *current = head.next;
    struct node *next = NULL;
    while (current != NULL) {
        next = current->next;
        current->next = prev;
        prev = current;
        current = next;
    }

    head.next = prev;

    printf("\nAfter reverse: ");
    temp = head.next;
    while (temp != NULL) {
        printf("%d  ", temp->data);
        temp = temp->next;
    }

    free(arr);
    return 0;
}
