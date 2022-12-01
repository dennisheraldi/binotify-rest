import axios, { AxiosResponse } from 'axios';
import { xml2json } from 'xml-js';

class Soap {
    private static axIns = axios.create({
        baseURL: `http://${process.env['SOAP_HOST']}/`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env['REST_API_KEY']}`,
            'Content-Type': 'text/xml',
        },
        transformRequest: function (data, h) {
            let body = '';
            for (let x in data['args']) {
                body += `<${x}>${data['args'][x]}</${x}>`;
            }
            const soapMessage: string = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <ns:${data['port']} xmlns:ns="http://service.soap.binotify.com/">
            ${body}
        </ns:${data['port']}>
    </soap:Body>
</soap:Envelope>`;
            console.log(soapMessage, h);
            return soapMessage;
        },
        transformResponse: function(data, h) {
            if (h['content-type']?.startsWith('text/xml')) {
                const res = JSON.parse(xml2json(data, { compact: true }));
                const body = res['S:Envelope']['S:Body'];
                let resObj = {};
                if ('S:Fault' in body) {
                    resObj = {
                        'error': {
                            'code': body['S:Fault'].faultcode._text,
                            'message': body['S:Fault'].faultstring._text,
                        } 
                    };
                    console.log(body, resObj, data);
                } else {
                    const fk = Object.keys(body)[0];
                    const retval = fk ? body[fk]['return'] : null;
                    let result : any = { result: null };
                    if (retval) {
                        if (Array.isArray(retval))
                            result = retval.map((v: { [key: string]: { [key: string]: string } }) => {
                                if ('_text' in v) { // handle non-object e.g. [0,1,2]
                                    return v['_text'];
                                }
                                let res : { [key: string]: any } = {}; // handle object e.g. [{a:1,b:2}]
                                for (let k in v) {
                                    res[k] = v[k]?.['_text'];
                                }
                                return res;
                            });
                        else
                            result = retval['_text']; // handle non-object e.g. 0
                    }
                    resObj = { result }
                }
                return resObj;
            } else {
                console.log(data, h);
                return {
                    'error': {
                        'code': 'S:Server',
                        'message': 'Server doesn\'t give xml response.',
                    }
                }
            }
        }
    });
    private static ins: Soap | null = null;
    private static lastResp: AxiosResponse | null = null;

    static getInstance() {
        if (Soap.ins == null)
            Soap.ins = new Soap();
        return Soap.ins;
    }

    static async call(method: string, args: object) {
        try {
            this.lastResp = await Soap.axIns('', {
                data: {
                    port: method,
                    args
                }
            });
            return this.lastResp?.data;
        } catch (e) {
            if (e instanceof axios.AxiosError)
                return e.response?.data ?? { 
                    'error': {
                        'code': 'S:Server',
                        'message': 'Axios error without data.',
                    }
                };
            return {
                'error': {
                    'code': 'S:Server',
                    'message': 'Unknown error.',
                }
            }
        }
    }

    static getLastResponse() : AxiosResponse | null {
        return this.lastResp;
    }
}

export const soapClient = Soap;