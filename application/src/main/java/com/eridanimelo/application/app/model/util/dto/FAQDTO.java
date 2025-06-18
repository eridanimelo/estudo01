package com.eridanimelo.application.app.model.util.dto;

import java.io.Serializable;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.lang.Long;

public class FAQDTO implements Serializable {

    @JsonIgnore
    private static final long serialVersionUID = 1L;

    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    private String question;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    private String answer;

}
