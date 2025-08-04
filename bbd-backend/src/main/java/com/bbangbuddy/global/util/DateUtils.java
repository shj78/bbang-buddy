//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//
package com.bbangbuddy.global.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoField;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/** * @PackageName : com.bbangbuddy.global.util
 * @FileName : DateUtils
 * @Author : hjsim
 * @Date : 2025-06-10
 * @Description : QueryPathBuilder의 날짜 및 시간을 처리하는 유틸리티 클래스
 */
@Slf4j
@NoArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class DateUtils {

    public static boolean validationDate(String checkDate, String targetFormat) {
        DateTimeFormatter dateFormatter = (new DateTimeFormatterBuilder()).appendPattern(targetFormat).toFormatter();
        try {
            LocalDate.parse(checkDate, dateFormatter);
            return true;
        } catch (DateTimeParseException var4) {
            return false;
        }
    }

    private static boolean validatedTimeFormat(String format) {
        return format.contains("HH") || format.contains("mm") || format.contains("ss");
    }

    public static LocalDateTime parseLocalDateTime(String date, String format) {
        DateTimeFormatter formatter;
        if (format.contains("SSS")) {
            String dateTimeStr = format.replace("SSS", "");
            formatter = (new DateTimeFormatterBuilder()).appendPattern(dateTimeStr).appendValue(ChronoField.MILLI_OF_SECOND, 3).toFormatter().withZone(ZoneOffset.systemDefault());
        } else {
            formatter = (new DateTimeFormatterBuilder()).appendPattern(format).toFormatter().withZone(ZoneOffset.systemDefault());
        }

        LocalDate localDate = LocalDate.parse(date, formatter);

        if (validatedTimeFormat(format)) {
            ZonedDateTime zonedDateTime = ZonedDateTime.parse(date, formatter);
            return zonedDateTime.toLocalDateTime();
        } else {
            return localDate.atStartOfDay();
        }
    }

    public static LocalDate parseLocalDate(String date, String format) {
        return parseLocalDateTime(date, format).toLocalDate();
    }

}
