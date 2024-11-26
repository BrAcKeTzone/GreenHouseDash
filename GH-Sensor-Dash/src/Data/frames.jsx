const baseUrl = "https://thingspeak.com/channels/2664461";

const frames = [
  {
    title: "Temperature",
    src: `${baseUrl}/widgets/935622`,
    exportUrls: {
      json: `${baseUrl}/fields/1.json`,
      xml: `${baseUrl}/fields/1.xml`,
      csv: `${baseUrl}/fields/1.csv`,
    },
  },
  {
    title: "Humidity",
    src: `${baseUrl}/widgets/935625`,
    exportUrls: {
      json: `${baseUrl}/fields/2.json`,
      xml: `${baseUrl}/fields/2.xml`,
      csv: `${baseUrl}/fields/2.csv`,
    },
  },
  {
    title: "pH Level",
    src: `${baseUrl}/charts/3?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=15&title=pH+Level&type=line`,
    exportUrls: {
      json: `${baseUrl}/fields/3.json`,
      xml: `${baseUrl}/fields/3.xml`,
      csv: `${baseUrl}/fields/3.csv`,
    },
  },
  {
    title: "Distance / Ultrasonic",
    src: `${baseUrl}/charts/4?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=15&title=Distance%2FUltrasonic&type=line`,
    exportUrls: {
      json: `${baseUrl}/fields/4.json`,
      xml: `${baseUrl}/fields/4.xml`,
      csv: `${baseUrl}/fields/4.csv`,
    },
  },
  {
    title: "TDS",
    src: `${baseUrl}/charts/5?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=15&title=TDS&type=line`,
    exportUrls: {
      json: `${baseUrl}/fields/5.json`,
      xml: `${baseUrl}/fields/5.xml`,
      csv: `${baseUrl}/fields/5.csv`,
    },
  },
];

export {frames, baseUrl};
