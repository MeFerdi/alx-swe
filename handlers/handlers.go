package api

import (
	"encoding/json"
	"log"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"text/template"
)

var errorTemplate *template.Template

/*
Init initializes the error template for the application.
It attempts to parse the error.html template file. If parsing fails,
it creates a simple fallback template to ensure error rendering.
This function should be called once at the start of the application.
*/
func Init() {
	var err error
	errorTemplate, err = template.ParseFiles("template/error.html")
	if err != nil {
		// log.Printf("Warning: Error parsing error template: %v", err)
		// Create a simple fallback template
		errorTemplate = template.Must(template.New("error").Parse(`
            <html><body>
            <h1>Error {{.Code}}</h1>
            <p>{{.Message}}</p>
            </body></html>
        `))
		//  log.Println("Error parsing, using fallback template")
	}
}

/*
renderError handles the rendering of error pages.
It sets the HTTP status code, executes the error template with the provided status and message,
and logs any errors that occur during template execution.
Parameters:
  - w: http.ResponseWriter to write the response
  - status: HTTP status code for the error
  - message: Error message to display
*/
type SearchResult struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

// SearchHandler handles search requests for "first album" and "creation date

func renderError(w http.ResponseWriter, status int, message string) {
	Init()
	w.WriteHeader(status)
	err := errorTemplate.Execute(w, struct {
		Code    int
		Message string
	}{
		Code:    status,
		Message: message,
	})
	if err != nil {
		log.Printf("Error rendering error template: %v", err)
	}
}

/*
HomeHandler manages requests to the home page of the application.
It checks if the requested path is the root ("/") and if the HTTP method is GET.
If these conditions are not met, it renders appropriate error pages.
Otherwise, it parses and executes the home.html template.

Parameters:
  - w: http.ResponseWriter to write the response
  - r: *http.Request containing the request details
*/
func HomeHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		renderError(w, http.StatusNotFound, "The Page you're trying to acess is unavailable")
		return
	}

	if r.Method != http.MethodGet {
		renderError(w, http.StatusMethodNotAllowed, "Wrong method")
		return
	}

	// Parse the homepage template
	temp, err := template.ParseFiles("template/home.html") // Ensure you have home.html in the template directory
	if err != nil {
		renderError(w, http.StatusInternalServerError, "Error loading template")
		return
	}

	// Execute the template and write to the response
	err = temp.Execute(w, nil) // No data is passed to the homepage template
	if err != nil {
		renderError(w, http.StatusInternalServerError, "Error executing template")
	}
}

/*
ArtistsHandler manages requests to the artists listing page.
It verifies the correct URL path and HTTP method, then fetches and displays
the list of artists. If any errors occur during this process, it renders
appropriate error pages.

Parameters:
  - w: http.ResponseWriter to write the response
  - r: *http.Request containing the request details
*/
func ArtistsHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/artists" && r.URL.Path != "/artists/" {
		renderError(w, http.StatusNotFound, "The Page you're trying to access is unavailable")
		return
	}

	if r.Method != http.MethodGet {
		renderError(w, http.StatusMethodNotAllowed, "Wrong method")
		return
	}

	// Fetch all artists
	result, err := ReadArtists("https://groupietrackers.herokuapp.com/api/artists")
	if err != nil {
		renderError(w, http.StatusInternalServerError, "Error fetching artists")
		return
	}

	// Check if it's a search request
	query := r.URL.Query().Get("q")
	if query != "" {
		// Perform search
		searchResults := searchArtists(result, query)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(searchResults)
		return
	}

	// If not a search request, render the full artists page
	templatePath := filepath.Join("template", "artists.html")
	temp1, err := template.ParseFiles(templatePath)
	if err != nil {
		renderError(w, http.StatusInternalServerError, "Error loading template")
		return
	}

	err = temp1.Execute(w, result)
	if err != nil {
		renderError(w, http.StatusInternalServerError, "Error executing template")
	}
}

func searchArtists(artists []Artist, query string) []map[string]string {
	var results []map[string]string
	query = strings.ToLower(query)

	for _, artist := range artists {
		// Search artist name
		if strings.Contains(strings.ToLower(artist.Name), query) {
			results = append(results, map[string]string{
				"name": artist.Name,
				"type": "artist/band",
				"id":   strconv.Itoa(artist.ID),
			})
		}
		// Search for Album date
		if strings.Contains(strings.ToLower(artist.FirstAlbum), query) {
			results = append(results, map[string]string{
				"name": artist.FirstAlbum,
				"band": artist.Name,
				"type": "artist/band",
				"id":   strconv.Itoa(artist.ID),
			})
		}
		// Search for Creation Dates
		if strings.Contains(strings.ToLower(strconv.Itoa(artist.CreationDate)), query) {
			results = append(results, map[string]string{
				"name": strconv.Itoa(artist.CreationDate),
				"band": artist.Name,
				"type": "artist/band",
				"id":   strconv.Itoa(artist.ID),
			})
		}

		// Search members
		for _, member := range artist.Members {
			if strings.Contains(strings.ToLower(member), query) {
				results = append(results, map[string]string{
					"name":     member,
					"type":     "member",
					"bandName": artist.Name,
					"id":       strconv.Itoa(artist.ID),
				})
			}
		}

		// Search locations
		locations, err := fetchLocations(artist.Locations)
		if err == nil {
			for _, location := range locations {
				if strings.Contains(strings.ToLower(location), query) {
					results = append(results, map[string]string{
						"name":     location,
						"type":     "location",
						"bandName": artist.Name,
						"id":       strconv.Itoa(artist.ID),
					})
				}
			}
		}
	}

	return results
}

func fetchLocations(locationURL string) ([]string, error) {
	resp, err := http.Get(locationURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var locationData struct {
		Locations []string `json:"locations"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&locationData); err != nil {
		return nil, err
	}

	return locationData.Locations, nil
}

type ArtistData struct {
	Artist       Artist    `json:"artist"`
	Dates        DateEntry `json:"dates"`
	Locations    Location  `json:"locations"`
	Relations    Relation  `json:"relations"`
	Section      string    `json:"section"`
	CreationDate int       `json:"creationDate"`
	ConcertDates string    `json:"concertDates"`
}

func ArtistHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		renderError(w, http.StatusMethodNotAllowed, "Wrong method")
		return
	}

	if !strings.HasPrefix(r.URL.Path, "/artist/") || len(strings.Split(r.URL.Path, "/")) != 3 {
		renderError(w, http.StatusNotFound, "The Page you're trying to access is unavailable")
		return
	}

	id1 := strings.Split(r.URL.Path, "/")
	if len(id1) < 3 {
		renderError(w, http.StatusBadRequest, "Artist ID not found")
		return
	}

	id := id1[len(id1)-1]

	// Check for the section query parameter
	section := r.URL.Query().Get("section")
	if section != "" && section != "locations" && section != "dates" && section != "relations" && section != "all" {
		renderError(w, http.StatusNotFound, "The section you're trying to access is unavailable")
		return
	}

	// Fetch artist details
	baseURL := "https://groupietrackers.herokuapp.com/api/artists/"
	artistResult, err := ReadArtist(baseURL, id)
	if err != nil || artistResult.ID == 0 {
		renderError(w, http.StatusNotFound, "The Page you're trying to access is unavailable")
		return
	}

	// Fetch related data: dates, locations, relations
	datesResult, err := ReadDate("https://groupietrackers.herokuapp.com/api/dates/", id)
	if err != nil {
		renderError(w, http.StatusInternalServerError, "Error fetching dates")
		return
	}

	locationsResult, err := ReadLocation("https://groupietrackers.herokuapp.com/api/locations/", id)
	if err != nil {
		renderError(w, http.StatusInternalServerError, "Error fetching locations")
		return
	}

	relationsResult, err := ReadRelations("https://groupietrackers.herokuapp.com/api/relation/", id)
	if err != nil {
		renderError(w, http.StatusInternalServerError, "Error fetching relations")
		return
	}

	// Combine all results into a single struct to pass to the template
	artistData := ArtistData{
		Artist:    artistResult,
		Dates:     datesResult,
		Locations: locationsResult,
		Relations: relationsResult,
		Section:   section, // Add this line to pass the section to the template
	}

	// Load and execute the artist template with combined data
	temp1, err := template.ParseFiles("template/artist.html")
	if err != nil {
		renderError(w, http.StatusInternalServerError, "Error loading template")
		return
	}

	err = temp1.Execute(w, artistData)
	if err != nil {
		renderError(w, http.StatusInternalServerError, "Error executing template")
	}
}
