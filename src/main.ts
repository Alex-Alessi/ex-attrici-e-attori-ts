const API_URL = "http://localhost:3333";

type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};

function isActress(dati: unknown): dati is Actress {
  if (
    typeof dati === "object" &&
    dati !== null &&
    "id" in dati &&
    typeof dati.id === "number" &&
    "name" in dati &&
    typeof dati.name === "string" &&
    "birth_year" in dati &&
    typeof dati.birth_year === "number" &&
    "death_year" in dati &&
    typeof dati.death_year === "number" &&
    "biography" in dati &&
    typeof dati.biography === "string" &&
    "image" in dati &&
    typeof dati.image === "string" &&
    "most_famous_movies" in dati &&
    dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every((m) => typeof m === "string") &&
    "awards" in dati &&
    typeof dati.awards === "string" &&
    "nationality" in dati &&
    typeof dati.nationality === "string" &&
    [
      "British",
      "Australian",
      "Israeli-American",
      "South African",
      "French",
      "Indian",
      "Israeli",
      "Spanish",
      "South Korean",
      "Chinese",
    ].includes(dati.nationality)
  ) {
    return true;
  }
  return false;
}

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality:
    | "American"
    | "British"
    | "Australian"
    | "Israeli-American"
    | "South African"
    | "French"
    | "Indian"
    | "Israeli"
    | "Spanish"
    | "South Korean"
    | "Chinese";
};

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`${API_URL}/actresses/${id}`);
    const dati: unknown = await response.json();
    if (!response.ok) {
      throw new Error(
        "Errore HTTP" + response.status + " :" + response.statusText
      );
    }

    if (!isActress(dati)) {
      throw new Error("Non è un'attrice");
    }
    return dati;
  } catch (errore) {
    console.error(errore);
    return null;
  }
}

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch(`${API_URL}/actresses`);
    if (!response.ok) {
      throw new Error(
        "Errore HTTP" + response.status + " :" + response.statusText
      );
    }
    const dati: unknown = await response.json();
    if (!(dati instanceof Array)) {
      throw new Error("Non è un array");
    }
    const attrici: Actress[] = dati.filter((a) => isActress(a));
    return attrici;
  } catch (error) {
    console.error(error);
    return [];
  }
}

function getActresses(idArray: number[]): Promise<(Actress | null)[]> {
  const listaAttrici: Promise<Actress | null>[] = idArray.map((i) =>
    getActress(i)
  );
  return Promise.all(listaAttrici);
}
