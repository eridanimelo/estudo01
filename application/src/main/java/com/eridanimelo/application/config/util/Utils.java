package com.eridanimelo.application.config.util;

import java.text.Normalizer;

public class Utils {

    public static String removeAccents(String str) {
        return Normalizer.normalize(str, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
    }

}
