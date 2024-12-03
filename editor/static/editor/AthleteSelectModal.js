function searchAthletes(search, callback) {
    let results = [];
    const searchParams = new URLSearchParams({ query: search });
    fetch("/api/athlete_search?" + searchParams.toString()).then((response) => {
        if (response.ok) {
            response.json().then((athletes) => {
                callback(athletes);
            });
        }
    });
};

export function athleteSelectModal(callback) {
    let modal = document.createElement('div');
    modal.className = 'modal';

    let modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    let results_div = document.createElement('div');
    results_div.className = 'results';

    let input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search...';
    input.addEventListener('input', () => {
        let search = input.value;
        searchAthletes(search,
            (athletes) => {
                results_div.innerHTML = '';
                athletes.forEach((athlete) => {
                    let result = document.createElement('button');
                    console.log(athlete);
                    result.textContent = athlete[0][1].name;
                    result.addEventListener('click', () => {
                        callback(athlete[0][0]);
                        modal.remove();
                    });
                    results_div.appendChild(result);
                });
            }
        );
    });
    modalContent.appendChild(input);
    input.focus();

    let span = document.createElement('span');
    span.className = 'modal-close';
    span.textContent = '×';
    span.addEventListener('click', () => {
        modal.remove();
    });
    modalContent.appendChild(span);

    // add listener for esc key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', this);
        }
    });


    modalContent.appendChild(results_div);


    modal.appendChild(modalContent);

    document.body.appendChild(modal);
}