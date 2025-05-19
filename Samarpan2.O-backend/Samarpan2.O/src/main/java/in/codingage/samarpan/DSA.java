package in.codingage.samarpan;

public class DSA {
    public static String m(String s, char a, int i, int first, int last){
        System.out.println(last);
        if(i==s.length()){
            String res = "First occurrence found at index : "+ first + "Last occurrence found at index : "+ last;
            return res;
        }
        if (first == -1 && s.charAt(i)==a) {
            first = i;
        }
        if (first != -1 && s.charAt(i)==a) {
            last = i;
        }
        return m(s,a,i+1,first,last);
    }

    public static void main(String[] args) {
        m("abjkbnjaghvahbhjyag",'a',0,-1,-1);
    }
}
