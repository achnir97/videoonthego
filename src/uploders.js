/*const upload = async () => {

    const formData = new FormData();

    const { data } = this.props.file;

    formData.append('data', data, data.filename);
    // TODO(jim):
    // We really don't need to be making this requests from the client
    const token = Cookies.get(C.auth);

    let xhr = new XMLHttpRequest();
    let startTime = new Date().getTime();
    let secondsElapsed = 0;

    xhr.upload.onprogress = async (event) => {
      if (!startTime) {
        startTime = new Date().getTime();
      }

      secondsElapsed = (new Date().getTime() - startTime) / 1000;
      let bytesPerSecond = event.loaded / secondsElapsed;
      let secondsRemaining = (event.total - event.loaded) / bytesPerSecond;

      this.setState({
        ...this.state,
        loaded: event.loaded,
        total: event.total,
        secondsElapsed,
        bytesPerSecond,
        secondsRemaining,
      });
    };

    xhr.upload.onerror = async () => {
      
      alert(`Error during the upload: ${xhr.status}`);
      console.log(xhr.status)
      startTime = null;
      secondsElapsed = 0;
    };

    xhr.onloadend = (event: any) => {
      if (!event.target || !event.target.response) {
        return;
      }

      startTime = null;
      secondsElapsed = 0;
      if (event.target.status === 200) {
        let json = {};
        try {
          json = JSON.parse(event.target.response);
        } catch (e) {
          console.log(e);
        }
        this.setState({ ...this.state, final: json });
      } else {
        alert(`[${event.target.status}]Error during the upload: ${event.target.response}`);
      }
    };

    let targetURL1 = `${C.api.host}/content/add`;
    console.log(targetURL1)
    /*if (this.props.viewer.settings.uploadEndpoints && this.props.viewer.settings.uploadEndpoints.length) {
      targetURL1 = this.props.viewer.settings.uploadEndpoints[0];

      console.log(targetURL)
    }*

    xhr.open('POST', targetURL1);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    console.log(token)
    xhr.send(formData);
    this.setState({ ...this.state, loaded: 1 });
  };*/