(()=> {
    const API_KEY = "5Muqe6HOngq40S9xI6ZQJ7jDfvZUoS5f"

    class GiphyApp {
        constructor() {
            this.$imageGrid = $('#image-grid')
            this.$searchQuery = $('#search-query')
            this.$modal = new bootstrap.Modal(document.getElementById('gifModal'), {})
            this.$modalContent = $('#gifModal .modal-body')
            this.initEventHandlers()
        }

        initEventHandlers() {
            $('.navbar form').on('submit', (e)=> {
                e.preventDefault()
                this.refreshSearch()
            })

            $('[data-bs-dismiss]').on('click', (e)=> {
                this.$modal.hide()
            })
        }

        async refreshTrending() {
            let trending = await $.get("https://api.giphy.com/v1/gifs/trending",{
                api_key: API_KEY
            })
            console.log(trending)
            this.loadGifs(trending.data)
            return trending
        }

        async refreshSearch() {
            let query = this.$searchQuery.val()
            if (!query) {
                this.refreshTrending()
                return
            }

            let results = await $.get("https://api.giphy.com/v1/gifs/search", {
                api_key: API_KEY,
                q: query
            })

            this.loadGifs(results.data)
            return results
        }

        loadGifs(data) {
            this.$imageGrid.empty()

            for(const gif of data) {
                let url = gif.images.downsized.url
                let elem = $(`
                <div class='image'>
                    <img src='${url}' />
                </div>
                `)
                elem.on('click', (e)=> {
                    this.$modalContent.empty()
                    let userInfo = ''
                    if (gif.user) {
                        let user = gif.user
                        userInfo = `
                        <span>
                            <span>Added By: </span>
                            <a href='${user.profile_url}' target='_blank'>
                                <img class='avatar' src='${user.avatar_url}' title='${user.username}'>
                            </a>
                        </span>
                        `
                    }

                    this.$modalContent.append(`
                        <img src='${gif.images.original.url}' class='w-100'>
                        <div class='d-flex flex-column'>
                            <strong>${gif.title}</strong>
                            ${userInfo}
                            <div>
                                <span>${gif.import_datetime}</span>
                            </div>
                        </div>
                    `)
                    this.$modal.show()
                })

                this.$imageGrid.append(elem)
            }
        }

    }

    let app = new GiphyApp()
    app.refreshTrending()

})()