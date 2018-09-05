import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

public static List<HashMap<String, Object>> parseXmlToMap(String xmlString,String tp){

try {

DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();

Document doc = dBuilder.parse(new ByteArrayInputStream(xmlString.getBytes()));

doc.getDocumentElement().normalize();

List<HashMap<String, Object>> resultList = new ArrayList<HashMap<String,Object>>();

NodeList resultNode = doc.getElementsByTagName(tp);

for(int i = 0 ; i < resultNode.getLength(); i ++ ){

NodeList nList = resultNode.item(i).getChildNodes();

HashMap<String, Object> rm = new HashMap<String, Object>();
HashMap<String, Object> hm = new HashMap<String, Object>();

for(int j = 0 ; j < nList.getLength(); j++){

String nodeName = nList.item(j).getNodeName();
String nodeValue = nList.item(j).getTextContent();

hm.put(nodeName, nodeValue);
}

rm.put(tp, hm);
resultList.add(rm);
}

return resultList;

} catch (Exception e) {
e.printStackTrace();
}

return null;
}