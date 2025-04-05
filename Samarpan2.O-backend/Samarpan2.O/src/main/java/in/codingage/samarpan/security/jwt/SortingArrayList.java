package in.codingage.samarpan.security.jwt;

import java.util.ArrayList;

class Student {
    private String name;
    private int age;

    private ArrayList<Student> studentList = new ArrayList<>();

    Student(String name, int age){
        this.name = name;
        this.age = age;
    }

    public String getName(){
        return this.name;
    }

    public int getAge(){
        return this.age;
    }

    public void setName(String name){
        this.name = name;
    }

    public void setAge(int age){
        this.age = age;
    }

    public void setStudentList(String name, int age) {
        Student s1 = new Student(null,0);
        s1.setName(name);
        s1.setAge(age);
        studentList.add(s1);
    }

    public void getStudentList(String name, int age) {
        Student s1 = new Student(name,age);
        studentList.add(s1);
    }


//    public String toString() {
//        return this.name + "  " + this.age;
//    }
}

class Sort{
    public static void main(String[] args) {

        Student s1 = new Student(null , 0);
        s1.setStudentList("aman", 45);

    }
}

