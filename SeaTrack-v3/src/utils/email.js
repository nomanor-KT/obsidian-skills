import { STATUS_CFG } from "../constants/index.js";

export const buildShipmentStatusEmail = (shipment) => {
  const statusLabel = STATUS_CFG[shipment.status]?.label || shipment.status || "Brak statusu";
  const templateByStatus = {
    booked: [
      "Przesylka jest potwierdzona i oczekuje na kolejne operacje.",
      "Bede informowac na biezaco o zmianie etapu.",
    ],
    delivered_to_port: [
      "Ladunek zostal dostarczony do portu i oczekuje na operacje armatorskie.",
      "Po potwierdzeniu wyplyniecia wysle kolejna aktualizacje.",
    ],
    departed: [
      "Jednostka wyplynela zgodnie z harmonogramem.",
      "Kolejna aktualizacja po wejsciu w pelny tranzyt.",
    ],
    in_transit: [
      "Przesylka jest aktualnie w tranzycie morskim.",
      "Monitorujemy ETA i damy znac przy kazdej istotnej zmianie.",
    ],
    arrived: [
      "Przesylka przybyla do portu docelowego.",
      "Kolejny krok to proces odprawy i wydania.",
    ],
    customs: [
      "Przesylka jest aktualnie na etapie odprawy.",
      "Po zakonczonej odprawie przeslemy potwierdzenie wydania.",
    ],
    gone_out: [
      "Przesylka opuscila port i jest po stronie dostawy koncowej.",
      "Temat uznajemy za operacyjnie domkniety.",
    ],
  };
  const intro = templateByStatus[shipment.status] || ["Przesylamy aktualizacje statusu przesylki."];

  const lines = [
    "Dzien dobry,",
    "",
    `Przesylamy aktualizacje statusu przesylki ${shipment.id || ""}.`,
    ...intro,
    "",
    `Status: ${statusLabel}`,
    `Klient: ${shipment.client || "-"}`,
    `Trasa: ${shipment.route || "-"}`,
    `ETD: ${shipment.etd || "-"}`,
    `ETA: ${shipment.eta || "-"}`,
    `B/L: ${shipment.bl || "-"}`,
    `Kontener: ${shipment.container || "-"}`,
    `Odprawiony (c/c): ${shipment.customsCleared ? "TAK" : "NIE"}`,
    `Dostarczony (DEL): ${shipment.delivered ? "TAK" : "NIE"}`,
    "",
    "W razie pytan pozostaje do dyspozycji.",
    "",
    "Pozdrawiam,",
  ];

  return {
    subject: `Status przesylki ${shipment.id || ""}`,
    body: lines.join("\n"),
  };
};

export const buildTransportOrderEmail = (shipment, carrierName) => {
  const lines = [
    "Dzien dobry,",
    "",
    "W zalaczeniu przesylamy zlecenie transportowe do realizacji.",
    "",
    shipment?.id ? `Shipment / ref: ${shipment.id}` : "",
    carrierName ? `Przewoznik: ${carrierName}` : "",
    shipment?.client ? `Klient: ${shipment.client}` : "",
    shipment?.route ? `Trasa: ${shipment.route}` : "",
    shipment?.container ? `Kontener: ${shipment.container}` : "",
    shipment?.bl ? `HBL: ${shipment.bl}` : "",
    shipment?.mbl ? `MBL: ${shipment.mbl}` : "",
    "",
    "Prosze o potwierdzenie przyjecia zlecenia.",
    "",
    "Pozdrawiam,",
  ].filter((line, index, array) => line || (index > 0 && array[index - 1] !== ""));

  return {
    subject: `Zlecenie transportowe ${shipment?.id || ""}`.trim(),
    body: lines.join("\n"),
  };
};

export const extractEmails = (...values) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return values
    .flatMap(value => String(value || "").split(/[;,\s]+/).map(v => v.trim()).filter(Boolean))
    .filter((value, index, array) => array.indexOf(value) === index)
    .filter(value => emailRegex.test(value));
};
