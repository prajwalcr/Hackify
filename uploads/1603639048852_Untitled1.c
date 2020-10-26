#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct node
{
    int data;
    struct node *left;
    struct node *right;
} Node;

typedef struct tree
{
    Node *root;
} Tree;

void tree_initialize(Tree *tree);
void tree_insert(Tree *tree, int data);
void inorder(Tree *tree);
void preorder(Tree *tree);
void postorder(Tree *tree);
void tree_delete(Tree *tree, int data);
void tree_destroy(Tree *tree);

int main()
{
    int choice, loop = 1;
    Tree my_tree;
    tree_initialize(&my_tree);
    while (loop)
    {
        scanf("%d", &choice);
        switch (choice)
        {
            int number_of_elements, element, index;
            int data;
        case 1:
            /* Insert elements */
            scanf("%d", &element);
            tree_insert(&my_tree, element);
            break;
        case 2:
            /* Print elements in the preorder fashion */
            preorder(&my_tree);
            break;
        case 3:
            /* Print elements in the inorder fashion */
            inorder(&my_tree);
            break;
        case 4:
            /* Print elements in the postorder fashion */
            postorder(&my_tree);
            break;
	case 5:
            /* Delete elements */
            scanf("%d", &element);
            tree_delete(&my_tree, element);
            break;
        default:
            tree_destroy(&my_tree);
            loop = 0;
            break;
        }
    }
    return 0;
}

void tree_initialize(Tree *tree)
{
    //TODO
    tree->root = NULL;
}

void tree_insert(Tree *tree, int data)
{
// TODO : Insert element to create a BST
    Node *p = tree->root;
    Node *temp = (Node*)malloc(sizeof(Node));
    temp->data=data;
    temp->right=NULL;
    temp->left=NULL;
    if(p==NULL){
        tree->root = temp;
        return;
    }
    Node *q;
    while(p!=NULL){
        q=p;
        if(p->data>temp->data){
            p=p->left;
        }
        else{
            p=p->right;
        }
    }
    if(temp->data<q->data){
        q->left=temp;
    }
    else{
        q->right=temp;
    }
}

Node* delNode(Node *root, int ele){
    Node *temp;
    if(root == NULL) return NULL;
    if(ele<root->data){
        root->left = delNode(root->left, ele);
    }
    else if (ele>root->data){
        root->right = delNode(root->right, ele);
    }
    else{
        if (root->left == NULL){
            temp = root->right;
            free(root);
            return temp;
        }
        else if (root->right == NULL){
            temp = root->left;
            free(root);
            return temp;
        }
        else{
            temp = root->right;
            while(temp->left != NULL){
                temp=temp->left;
            }
            root->data = temp->data;
            root->right = delNode(root->right, temp->data);
            return root;
        }
    }
}

void tree_delete(Tree *tree, int element)
{
   // TODO : Delete elements from BST
   tree->root = delNode(tree->root, element);
}

void tree_inorder(Node *r)
{
 	//TODO :  use printf to print inorder
 	if(r==NULL) return;
 	tree_inorder(r->left);
 	printf("%d ", r->data);
 	tree_inorder(r->right);

}

void tree_preorder(Node *r)
{
    //TODO :  use printf to print preorder
    if(r==NULL) return;
 	printf("%d ", r->data);
 	tree_preorder(r->left);
 	tree_preorder(r->right);
}

void tree_postorder(Node *r)
{
    //TODO :  use printf to print postorder
    if(r==NULL) return;
 	tree_postorder(r->left);
 	tree_postorder(r->right);
    printf("%d ", r->data);
}

void postorder(Tree *t)
{
   //TODO
   tree_postorder(t->root);
}

void preorder(Tree *t)
{
     //TODO
     tree_preorder(t->root);
}

void inorder(Tree *t)
{
  //TODO
  tree_inorder(t->root);
}

void destroy(Node *r)
{
  //TODO
  if(r!=NULL){
    destroy(r->right);
    destroy(r->left);
    free(r);
  }
}

void tree_destroy(Tree *t)
{
//TODO
    destroy(t->root);
    free(t);
}
