package edu.boisestate.cloudcomputing.whiteboardapi.util;

import java.util.ArrayList;

import com.google.gson.Gson;

public class JSONTansformer {
	public static String ConvertToJSON(ArrayList<?> data) {
		String strData = null;
		Gson gson = new Gson();
		strData = gson.toJson(data);
		return strData;
	}
}
