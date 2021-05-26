import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConectionSoapService {

  requestOptions: any;

  constructor(private http: HttpClient) { }

  getSoapData(): any {

    // const url = 'http://190.152.15.66:8080/Sistema_AbastcedoraLocal/servlet/aconsultagarantia?wsdl';

    // const params = new HttpParams();
    // params.set('Cgccodcom', '0002');
    // params.set('Clave', '12345678');

    // this.http.get(url, { responseType: 'text', params, })
    //   .pipe(
    //     map((xmlString: string) => {
    //       // const asJson = this.xmlStringToJson(xmlString);
    //       // return asJson;
    //       return xmlString;
    //     }),
    //     catchError((err) => {
    //       console.warn('INT ERR:', err);
    //       return err;
    //     })
    //   );

    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/soap+xml');
    myHeaders.append('Cookie', 'JSESSIONID=E063013EEF03651FEC0018D61E33892E');

    const raw = '<Envelope xmlns=\"http://schemas.xmlsoap.org/soap/envelope/\">\r\n    <Body>\r\n        <ConsultaGarantia.Execute xmlns=\"Sistema_Abastcedora\">\r\n            <Cgccodcom>0002</Cgccodcom>\r\n            <Clave>12345678</Clave>\r\n            <Garantia>\r\n                <CGCCODCOM>?</CGCCODCOM>\r\n                <CGCComercializadora>?</CGCComercializadora>\r\n                <CGCUNIMON>?</CGCUNIMON>\r\n                <CGCVALCOM>?</CGCVALCOM>\r\n                <CGCSUMAVA>?</CGCSUMAVA>\r\n                <Garantia98>?</Garantia98>\r\n                <CGCSALDO>?</CGCSALDO>\r\n                <SaldoDisponible>?</SaldoDisponible>\r\n                <PorcentajeUso>?</PorcentajeUso>\r\n            </Garantia>\r\n        </ConsultaGarantia.Execute>\r\n    </Body>\r\n</Envelope>';

    this.requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch('http://190.152.15.66:8080/Sistema_AbastcedoraLocal/servlet/aconsultagarantia?wsdl', this.requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

  }

  // xmlStringToJson(xml: string): any {
  //   const oParser = new DOMParser();
  //   const xmlDoc = oParser.parseFromString(xml, 'application/xml');
  //   /* xmlStringToJson(xml: string) */
  //   // ...
  //   return this.xmlToJson(xmlDoc);
  // }

  // xmlToJson(xml: any): any {
  // // Create the return object
  // let obj = {};

  // if (xml.nodeType === 1) { // element
  //   // do attributes
  //   if (xml.attributes.length > 0) {
  //   obj["@attributes"] = {};
  //     for (var j = 0; j < xml.attributes.length; j++) {
  //       var attribute = xml.attributes.item(j);
  //       obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
  //     }
  //   }
  // } else if (xml.nodeType == 3) { // text
  //   obj = xml.nodeValue;
  // }

  // // do children
  // if (xml.hasChildNodes()) {
  //   for (let i = 0; i < xml.childNodes.length; i++) {
  //     const item = xml.childNodes.item(i);
  //     const nodeName = item.nodeName;
  //     if (typeof(obj[nodeName]) === "undefined") {
  //       obj[nodeName] = this.xmlToJson(item);
  //     } else {
  //       if (typeof(obj[nodeName].push) === "undefined") {
  //         var old = obj[nodeName];
  //         obj[nodeName] = [];
  //         obj[nodeName].push(old);
  //       }
  //       obj[nodeName].push(this.xmlToJson(item));
  //     }
  //   }
  // }
  // return obj;
  // }

}
