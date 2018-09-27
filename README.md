# InfoSida OBS! Detta är fortfarande beta! Information är inte granskad!!
## Vad är detta?
Detta är ett projekt som ämnar ersätta informationsfoldrarna patienterna får när de blir inlagda på sjukhuset. Projektet i sig kommer få verksamheten att se över informationsfoldrarna som innan samlat damm, då den informationen nu blir mer tillgänglig. Största målet är att göra det så enkelt för vårdpersonalen om inte enklare att göra förändringar, så informationen alltid är aktuell.

Följande förbättring kommer projektet att bidra med:
* Möjlighet för personer med lässvårigheter ska kunna ta till sig informationen.
* Sidan ska i möjligaste mån följa (”Web Content Accessibility Guidelines 2.0”)[ https://www.w3.org/TR/WCAG20/]
* Via mallar göra det enkelt för vårdpersonalen att lägga till nya avsnitt eller justera informationen.
* Interaktiva element på sidan för att lättare föra fram informationen.
* Personligt anpassad information utifrån patientens diagnos, åtgärd eller situation.
* Möjlighet att presentera olika språk.

## Varför räcker inte avdelningarnas "externa" sidor?!?
För att de primärt är till för patienter som ännu inte lagts in på sjukhuset. Även är de oftast opersonliga från vårdavdelningen.

## API
All text på sidan skriver man enligt "JSON" format och enligt följande API
### Mapp struktur
Alla filer som används för specifik avdelning läggs i "public/assets".
Här är mappar för alla avdelningar som stödjs.
### Info.json
"public/assets/[avdelnings tagg]/info.json"
Följande kod är basen för "info.json":
```
{
	"avdinfo": {
		"avdid": "",
		"titel": "",
		"titelkort": "",
		"info": ""
	},
	"data": [ ... ]
}
```
Följande kod läggs i "data" och representerar en sida:
```
{
	"knapp": {
		"img": {
			"aktiv": "[Bild namn och bildtyp när knapp är aktiverad]",
			"deaktiv": "[Bild namn och bildtyp när knapp inte är aktiverad]"
		},
		"text": {
			"sv": "[Knapp text]"
		}
	},
	"innehall": [ ... ]
}
```
Följande kod läggs i "innehall":
Rubrik:
```
{
	"type": "rubrik",
	"sv": "[Text]"
}
```
Normal text:
```
{
	"type": "normal",
	"sv": ["[Text]", "[Text som skapar ny rad]" .... ]
}
```
Inställningar:
```
{
	"type": "installningar"
}
```
Tider:
```
{
	"type": "time",
	"times": [{
		"start": "[Start tid]",
		"end": "[Slut tid]",
		"colour": "[Bakgrundsfärg]",
		"sv": "[Beskrivning i text]"
	}, ...
	]
}
```
Karta:
```
{
	"type": "karta",
	"location": "[Vilket sjukhus]",
	"place": "[Plats]"
}
```
Bubbla:
```
{
	"type": "bubbla",
	"text": [{
		"type": "rubrik",
		"sv": "[Rubrik text]"
	},{
		"type": "normal",
		"sv": ["[Vanlig text i bubbla]", ... ]
	}, ... ]
}
```
Lista:
```
{
	"type": "lista",
	"sv": [
		"[Första texten i listan]",
		"[Andra texten i listan]",
		...
	]
}
```
Rutor (Öppettider):
```
{
	"type": "rutor",
	"rutor": [{
		"rubrik": {
			"sv": "[Rubrik på vad som har öppet]"
		},
		"plats": {
			"sv": "([Vägbeskrivning])"
		},
		"telefon": "[Telefonnummer]",
		"oppet": {
			"sv": [
				"[Öppettid]",
				...
			]
		}
	}, ... ]
}
```

## Testa
1. Ladda ner git repot
2. Öppna i konsolen
3. Skriv "npm i"
4. Skriv "node ."
5. Öppna länk i webbläsaren som står i konsolen

## Todo
* Revidera nuvarande information.
* Redigerare för vårdpersonal att lättare göra justeringar.
* Utvärdera tid visualiseringen.
* Lägg till fler språk.
* Flikar ska komma ihåg vilka som var öppna ifall sidan laddas om.
