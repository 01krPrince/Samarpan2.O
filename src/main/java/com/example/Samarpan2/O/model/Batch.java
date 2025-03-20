package com.example.Samarpan2.O.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "batch")
public class Batch {
    @Id
    private String id;
    private String batchName;

    private Branch branch;  // KANKARBAGH, BORING_ROAD
    public enum Branch {
        KANKARBAGH, BORING_ROAD
    }

}
