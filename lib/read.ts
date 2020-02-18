
export function getDataFromStream(url: string, onMessage: (message: string) => void, onComplete: () => void) {

    if (typeof (EventSource) === 'function') {
        let source = new EventSource(url, { withCredentials: true });
        source.addEventListener('end', () => {
            source.close();
            onComplete();
        });
        source.onmessage = (data: MessageEvent) => {
            onMessage(data.data);
        };
    } else {
        fetch(url, { credentials: 'omit' }).then((response: Response) => {
            if (response && response.body) {
                let reader = response.body.getReader();
                let decoder = new TextDecoder();
                let readData = (): void => {
                    reader.read().then(({ value, done }) => {
                        if (done) return onComplete();
                        let newData = decoder.decode(value, { stream: !done });
                        onMessage(newData);
                        return readData();
                    });
                }
                return readData();
            }
        }).catch(error => {
            throw error;
        });
    }
}
