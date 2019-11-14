self.addEventListener("fetch", event => {
  const url = event.request.url;
  const template = event.request.headers.get(
    "x-service-worker-wms-to-xyz-proxy-template"
  );
  if (!template) {
    return;
  } else {
    const indices = ["{x}", "{y}", "{z}"].map(pos =>
      template
        .split("/")
        .flatMap(flagment => flagment.split("."))
        .indexOf(pos)
    );

    const urlFlagments = url
      .split("/")
      .flatMap(flagment => flagment.split("."));

    const z = parseInt(urlFlagments[indices[2]]);
    const x = parseInt(urlFlagments[indices[0]]);
    const y = parseInt(urlFlagments[indices[1]]);
    const next_y = Math.pow(2, z) - y - 1;

    const convertedURL = template
      .replace("{x}", x)
      .replace("{y}", next_y)
      .replace("{z}", z);

    return event.respondWith(fetch(convertedURL));
  }
});
