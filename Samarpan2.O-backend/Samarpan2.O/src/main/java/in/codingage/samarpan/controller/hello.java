//package in.codingage.samarpan.controller;
//
//import java.util.*;
//
//class Employee {
//    String name;
//    int age;
//
//    public Employee(String name, int age) {
//        this.name = name;
//        this.age = age;
//    }
//
//    public String toString() {
//        return name + " - Age: " + age;
//    }
//}
//
//class EmployeeSorter {
//    public static void main(String[] args) {
//        ArrayList<Employee> employees = new ArrayList<>();
//        employees.add(new Employee("Alice", 30));
//        employees.add(new Employee("Bob", 25));
//        employees.add(new Employee("Charlie", 35));
//
//        Collections.sort(employees, new Comparator<Employee>() {
//            @Override
//            public int compare(Employee e1, Employee e2) {
//                return Integer.compare(e1.age, e2.age);
//            }
//        });
//
//        for (Employee emp : employees) {
//            System.out.println(emp);
//        }
//    }
//}