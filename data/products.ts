export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  tag?: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
}

export const allProducts: Product[] = [
  {
    id: "cerato-floral-final",
    name: "Cerato Floral Final",
    price: 145000,
    currency: "COP",
    category: "Arreglos",
    tag: "Edición Limitada",
    description: "Una composición magistral que captura la esencia de la primavera eterna. Cada tallo ha sido seleccionado por su vigor y belleza.",
    longDescription: "Diseñado artesanalmente con orquídeas cymbidium, rosas de jardín importadas y follaje silvestre preservado. Incluye jarrón de cerámica hecho a mano.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcnF6uyQgzUeAHwhwX2ui_xzBSjzE2N59vxsYy8IlkSlqo-QgEquo4-0DfhPrMAcfeW9Opxe9BjUvj1SXzab7pBvgNkslJ_9PTAZDyJRL928MA1jjzQWo2nwM9rGyxS6HqYHgcn1pHhXRCmyAFirLMO0xEoYv-OLt6xaePIqDXrCFtLk6Ep8BaaW11Qw6FlBASZK18rEvVg4W9RRAMfZMxhAzQQhBcxDagHqOZQw19zeU1ACRAzqUcpaImD7bL46kg1HAN6fX8ow",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCcnF6uyQgzUeAHwhwX2ui_xzBSjzE2N59vxsYy8IlkSlqo-QgEquo4-0DfhPrMAcfeW9Opxe9BjUvj1SXzab7pBvgNkslJ_9PTAZDyJRL928MA1jjzQWo2nwM9rGyxS6HqYHgcn1pHhXRCmyAFirLMO0xEoYv-OLt6xaePIqDXrCFtLk6Ep8BaaW11Qw6FlBASZK18rEvVg4W9RRAMfZMxhAzQQhBcxDagHqOZQw19zeU1ACRAzqUcpaImD7bL46kg1HAN6fX8ow",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBEitLSdq9Eg7k1QfBS9VOTTmV4ybu5woYqpIX4hFiD1s2Q7vb4vYNOITeqUhF_ACGISqUgxR57B5qca4c_zJjeBn1Bl4qBr7Vm_mTfX-DtFXGXaoteV2ynsQLYZW4cWRJbp2MiCr8wMrmHg6MFtKZr5MS6gll7NHIxzZIcou2pdzlZFS8feRk8SJHglr6jlKqQr5Ep8f60QJp1p2NJ4J5bPiIvKLrZ-DibHzm4lg-jH_D5Mlrn2IqyvbZsc3i-EJeCae_q4n8qTg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB5ckHm2HTB-jgQchHfZTwwBuWTvYcUcjIRJLjqQAsBX5qlfQXFcZ0KsIujTuePrWO_J77xfHQ1yPn6dTTqXDjgWtJMs_D8RUOxMLYSkZRySeLdq7J7Ow01TvT0B-cvQep7RE-e5zTLLN3JVcLUDZtUHszUlqDF2R-nd3pYpbwK65mhSyhVXgfzrjZfVuzYd21kloxkDSbLXW6kWKWan1CIShUcrozdai1ab-iiMAF0bqwslvwVv_syw5sSeqjg5opqLhSrmEsgRQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwTMDlc-465zouk_gZ09xVkdr7NZPPeoxBfPvhlt-lNhR5JdCo-8cRn6aLcS5W5rZjs6HKxpJSv-3-2qAG36IMSMzzPWxtLlS9Bqf-e-cA74ADg2zJeKKxyYqbP77Q-GFRyTCb22b-iN07UvKTr4dPKx_rke6eRRd9oFx8LbfcCTRfBaXRbxrVeLoF5M1n_PKP63P1IOxnB0GtWBnH9HueE87BPYAGtNu9i6anOdI-7aFh3OQoo_-DsOmWCaqamGeYLbJsRNT1WA"
    ]
  },
  {
    id: "10-gerberas",
    name: "10 gerberas",
    price: 45000,
    currency: "COP",
    category: "Ramos y Atados",
    description: "Una explosión de alegría en colores vibrantes.",
    longDescription: "Selección de 10 gerberas de colores variados con follaje de temporada.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBv_3_bmSdtd0GnSh5EHK0u0_H56GG3Kf_w-IDOHKIyW-PPwNs_tZR-Rs7AndhnNT7ubLRmz8qDyrlrrfnj-EH2def2GiQ1GRGxUojM7JR3zdP78DT7vnUixzilHMco80LOsqm2fXJPnZjKI5eLlSl7Pbu-uPVTSPvlj_5VfgN1PyYQnSJYTZniJczRyBXhjFV64tzWezEJMtRKx8f_4xWsGtXDnzwh78Lfyc61A-AVBsf0NAx763M53ybxtEfrVUPPt9vK3AjLQw",
    images: []
  },
  {
    id: "ramo-rosas-infinito",
    name: "Ramo de Rosas Infinito",
    price: 185000,
    currency: "COP",
    category: "Ramos y Atados",
    tag: "Colección Exclusiva",
    description: "Un ramo de rosas rojas de tallo largo que simboliza un amor eterno y sofisticado.",
    longDescription: "Presentamos 24 rosas de exportación cuidadosamente seleccionadas, acompañadas de follaje gypsophila y eucalipto preservado. Incluye envoltorio de lujo en papel seda francés y tarjeta de dedicatoria.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAxgepMjFTHNBiD4B83cWPQ9yKeGiI2lW0WeKwFKm1TNKSg1_pUo_KuMtUJrCv7PYsLSomHIcXDIaupWvQqCIi1trVrjaCDQWLAXI2vOHgNy_TcErWXNEpc9ZY5-paFLTbvgA1azJMGGaKxA91WnAiu-8FEy99JB-Lg2yBTxbHABfCbyp4aIMFnIkU-Y_mFZ3nfJqZS9GDXMe1Al5g_YiNX5n5s8BLpQq0ZPPamesqraQLTBV8AzikpkWFDl1KgDoU0uw-GsPN4g",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBAxgepMjFTHNBiD4B83cWPQ9yKeGiI2lW0WeKwFKm1TNKSg1_pUo_KuMtUJrCv7PYsLSomHIcXDIaupWvQqCIi1trVrjaCDQWLAXI2vOHgNy_TcErWXNEpc9ZY5-paFLTbvgA1azJMGGaKxA91WnAiu-8FEy99JB-Lg2yBTxbHABfCbyp4aIMFnIkU-Y_mFZ3nfJqZS9GDXMe1Al5g_YiNX5n5s8BLpQq0ZPPamesqraQLTBV8AzikpkWFDl1KgDoU0uw-GsPN4g",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD0qQvFNZ5Dus_9SmDhZIEpKZyy8omFXsqKnraqHypXtd3rFFaEGEooq4ypJzFoAILCYItWUJDb5QwqJJlCiohg0F0earIu3GOy7UqGhh0q6G8KQanyVUA4Plcz174M2YrsPFcPeaAC4YcAEOdumm7gbFCQx_qIJOKJBsP9HZyXNhu5gyueAWRHeC0qmy6a4Ox3Af1EzEzCYqjFerjCYktn19BcGZ4RzVnmFYnrty_t8sTsHvbEg8G117GHK5dgsxI4hUpsvvDfcQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBv_3_bmSdtd0GnSh5EHK0u0_H56GG3Kf_w-IDOHKIyW-PPwNs_tZR-Rs7AndhnNT7ubLRmz8qDyrlrrfnj-EH2def2GiQ1GRGxUojM7JR3zdP78DT7vnUixzilHMco80LOsqm2fXJPnZjKI5eLlSl7Pbu-uPVTSPvlj_5VfgN1PyYQnSJYTZniJczRyBXhjFV64tzWezEJMtRKx8f_4xWsGtXDnzwh78Lfyc61A-AVBsf0NAx763M53ybxtEfrVUPPt9vK3AjLQw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBZA3kbt-7LAy1pHXqim6_OkwIvMm-ycbis-l_o2gIhKpgaC8MkC7iS-jhFgCyAaUKLxW7FVywWF1Ijleu7GCiLM-cZcOSST3im_cPxtjPuIrA19nUJ7CYkVs2aVE5MvZwO9LyK-7I3c41AxJdrLOMvvKdgHuZ9G6z1oe_2jsYU5BlwrUjjvQk6fCj9vd5UZEvQmXztisMSNBukZFFIpgB5v9RjlTpNmX2XdulZmOLg-wqrcHw63qy6oQSL5JgMq-KzXjG0cQrJsg"
    ]
  },
  {
    id: "orquidea-purpura-imperial",
    name: "Orquídea Púrpura Imperial",
    price: 95000,
    currency: "COP",
    category: "Flores individuales y Orquídeas",
    tag: "Calidad Premium",
    description: "Una orquídea Phalaenopsis de doble tallo en un tono púrpura profundo y real.",
    longDescription: "Esta orquídea Phalaenopsis ha sido cultivada bajo condiciones óptimas para garantizar flores grandes y duraderas. Viene en una maceta decorativa de cerámica blanca que resalta el contraste del color púrpura. Ideal para decorar espacios interiores con un toque de elegancia natural.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj_zA4Eyk1BXqKaTe0IAtwHC_Sq17iazaUIfZ_wdE7cBWST0UZxIdzwec5e0lIrRRwVxIvApjqV7jidiKkY3J4-O7xEyif6UpXcn2u2bTyBXcUpTK-xhDNF23nBZGdWSaaW0Rv9XQ0AEXdeCaLwRxDK_heH9gLDt4_o3SkGRBcrvtmdb0RMnfme2YnvaKDXIvZloUa-PrDxVbGdgRu_hk3DW0HleUphzbWnvWmD3uKL0rS4DbYiWdsSpombMwQZ8IQfSGI2PYjaQ",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAj_zA4Eyk1BXqKaTe0IAtwHC_Sq17iazaUIfZ_wdE7cBWST0UZxIdzwec5e0lIrRRwVxIvApjqV7jidiKkY3J4-O7xEyif6UpXcn2u2bTyBXcUpTK-xhDNF23nBZGdWSaaW0Rv9XQ0AEXdeCaLwRxDK_heH9gLDt4_o3SkGRBcrvtmdb0RMnfme2YnvaKDXIvZloUa-PrDxVbGdgRu_hk3DW0HleUphzbWnvWmD3uKL0rS4DbYiWdsSpombMwQZ8IQfSGI2PYjaQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAE3wTrCDgFop23cBenSXDz1C1rzyZ0ANix675D704dcbhYQZWepyQg4N1EeVZSifAwQA1-DbNn6A3vWoPUDQJBhsIkkI0_A0SbgoHm7ozgieKLFgNCfPRX64dxnDJ0Hh5b-VuX4NPTzF8WrTixexllWIdbMP9p7NPRFNWrfYheWMI2JPZJrbZBuBpzXyrEZl_QJku5QXRbfirOT78S9q2DBtqVPhrdMC2tOf7CLO7YdvVFuqNCeb0sOKqexnFXELYz09oihP4UkQ",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuABiaQg9QMnR84NVTwB6ItZE4bZrhMUI5OYIc9U8joLhoRMW1mPz0OBcEHFHGtqnhIjIMhDlrtmmll7rZyCPLB11K1gWEwVis1w69g6rJ7_bRjbod9dvZpq_wq_lYerxRpv6L1uVnoPggGUuSdOk8_17EJFENtQLYvEVGemX7kYHPmpHq-bSxhCxD1NZYDh62mKSij8aeG1E7BmL22LGODFLPNOQG8x32aQP9orXWxel0JLj53imqFJYMMb3mCNJ7nR207IIvagkw"
    ]
  }
];
