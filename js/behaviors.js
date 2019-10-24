let c = new CETEI();
c.getHTML5('CORPUS2019-10-23SR.xml', function(data) {
  document.querySelector("body").appendChild(data);
});
let behaviors = {
  "tei": {
    "TEI": function(t) {
      let result = document.createElement("div");
      result.setAttribute('class', 'uk-grid');
      let titleWrapper = document.createElement("div");
      titleWrapper.setAttribute("class", "uk-width-1-1 uk-margin-medium-bottom uk-margin-medium-top");
      let title = document.createElement("h1");
      title.setAttribute("class", "uk-text-lead letter-title");

      // here we construct the title from who sent the letter to whom
      let sender = t.querySelector('tei-correspAction[type="sent"]>tei-persName');
      let recipient = t.querySelector('tei-correspAction[type="received"]>tei-persName');


      title.innerHTML = sender.innerHTML + " ל" + recipient.innerHTML;
      titleWrapper.appendChild(title);
      result.appendChild(titleWrapper);

      let letterContainer = document.createElement("div");
      letterContainer.setAttribute("id", "letter-container"); //need class here
      letterContainer.setAttribute("class", "uk-flex-auto uk-flex-1");
      letterContainer.innerHTML ='<ul class="uk-subnav uk-subnav-pill" uk-switcher><li><a href="#">Transcription</a></li><li><a href="#">Facsimile</a></li></ul>'; //Sinai
      let switcher = document.createElement("ul");
      switcher.setAttribute("class", "uk-switcher uk-margin"); //class
      let letter = document.createElement("li");
      letter.setAttribute("class", "letter"); //changed to class
      let facsimile = document.createElement("li");
      facsimile.setAttribute("class", "facsimile");
      facsimile.setAttribute("uk-lightbox", "true");
      //changed to class



      let gr = t.querySelector('tei-tei>tei-facsimile>tei-graphic');



      if (gr) {
        var holder = document.createElement("a");
        holder.setAttribute('href', gr.getAttribute("url"));
        let content = new Image();
        content.src = this.rw(gr.getAttribute("url"));
        content.setAttribute('class', 'uk-img');
        content.setAttribute('data-source', gr.getAttribute("url"));
        content.setAttribute('href', gr.getAttribute("url"));
        content.setAttribute("width", "500px");
        holder.appendChild(content);

        //facsimile.appendChild(this.copyAndReset(gr));
        facsimile.appendChild(holder);

      }




      for (let n of Array.from(t.childNodes)) {

        letter.appendChild(this.copyAndReset(n));
      }

      switcher.appendChild(letter);
      switcher.appendChild(facsimile);
      letterContainer.appendChild(switcher);

      let metadataWrapper = document.createElement("div");
      metadataWrapper.setAttribute("class", "uk-flex-left uk-margin-large-right");

      let table = document.createElement("table");
      table.setAttribute("class", "uk-table uk-table-responsive uk-table-divider");
      let caption = document.createElement("Caption");
      caption.innerHTML = "מטאדאטה"; //
      let tableBody = document.createElement("tbody");

      table.appendChild(caption);

      let senderRow = document.createElement("tr");
      let senderCell = document.createElement("th");
      senderCell.innerHTML="מאת"; //Sinai
      let senderData = document.createElement("td");
      //sender is defined above
      senderData.appendChild(sender);
      senderRow.appendChild(senderCell);
      senderRow.appendChild(senderData);

      let placeSentRow = document.createElement("tr");
      let placeSentCell = document.createElement("th");
      placeSentCell.innerHTML="מקום"; //Sinai
      let placeSentData = document.createElement("td");
      let placeSent = t.querySelector('tei-correspAction[type="sent"]>tei-placeName');
      placeSentData.appendChild(placeSent);
      placeSentRow.appendChild(placeSentCell);
      placeSentRow.appendChild(placeSentData);

      let dateRow = document.createElement("tr");
      let dateCell = document.createElement("th");
      dateCell.innerHTML="תאריך"; //Sinai
      let dateData = document.createElement("td");
      let date = t.querySelector('tei-correspAction[type="sent"]>tei-date').getAttribute("when");
      dateData.innerHTML=date;
      dateRow.appendChild(dateCell);
      dateRow.appendChild(dateData);



      let recipientRow = document.createElement("tr");
      let recipientCell = document.createElement("th");
      recipientCell.innerHTML="נמען/ת"; //Sinai
      let recipientData = document.createElement("td");
      //recipient is defined above
      recipientData.appendChild(recipient);
      recipientRow.appendChild(recipientCell);
      recipientRow.appendChild(recipientData);


      let placeReceivedRow = document.createElement("tr");
      let placeReceivedCell = document.createElement("th");
      placeReceivedCell.innerHTML="מען"; //Sinai
      let placeReceivedData = document.createElement("td");
      let placeReceived = t.querySelector('tei-correspAction[type="received"]>tei-placeName');
      placeReceivedData.appendChild(placeReceived);
      placeReceivedRow.appendChild(placeReceivedCell);
      placeReceivedRow.appendChild(placeReceivedData);


      table.appendChild(caption);

      tableBody.appendChild(senderRow);
      tableBody.appendChild(dateRow);
      tableBody.appendChild(placeSentRow);
      tableBody.appendChild(recipientRow);
      tableBody.appendChild(placeReceivedRow);

      table.appendChild(tableBody);

      metadataWrapper.appendChild(table);

      result.appendChild(letterContainer);
      result.appendChild(metadataWrapper);

      return result;
    },
    "head": function(e) {
      let level = document.evaluate("count(ancestor::tei-div)", e, null, XPathResult.NUMBER_TYPE, null);
      let result = document.createElement("h" + level.numberValue);
      for (let n of Array.from(e.childNodes)) {
        result.appendChild(n.cloneNode());
      }
      return result;
    },
    "lb": ["<br/>"],
    "placeName": function(pn){
      if (pn.hasAttribute('ref')) {
        var linked = document.createElement("a");
        linked.setAttribute('href', pn.getAttribute('ref'));
        linked.setAttribute('target', '_blank');
        linked.innerHTML = pn.innerHTML;
        return linked;
      }

    },
    "persName": function(pn){
      if (pn.hasAttribute('ref')) {
        var linked = document.createElement("a");
        linked.setAttribute('href', pn.getAttribute('ref'));
        linked.setAttribute('target', '_blank');
        linked.innerHTML = pn.innerHTML;
        return linked;
      }

    },
    "graphic": function(gr){
      var holder = document.createElement("a");
      holder.setAttribute('href', gr.getAttribute("url"));
      let content = new Image();
      content.src = this.rw(gr.getAttribute("url"));
      content.setAttribute('class', 'uk-img');
      content.setAttribute('data-source', gr.getAttribute("url"));
      content.setAttribute('href', gr.getAttribute("url"));
      content.setAttribute("width", "500px");
      holder.appendChild(content);
      //document.getElementById('facsimile').appendChild(holder);
      //document.querySelector('.facsimile').appendChild(holder); //this may need parent id
      //return holder;
    },
    "choice": function(ch){
      if (ch.querySelector("tei-corr")) {
        var spansic = document.createElement("span");
        spansic.setAttribute("class", "sic");
        spansic.setAttribute("uk-tooltip", ch.querySelector('tei-corr').innerHTML);
        spansic.appendChild(ch.querySelector('tei-sic'))
        return spansic;
      } else if (ch.querySelector("tei-expan")) {
        var spanabbr = document.createElement("span");
        spanabbr.setAttribute("class", "abbr");
        spanabbr.setAttribute("uk-tooltip", ch.querySelector('tei-expan').innerHTML);
        spanabbr.appendChild(ch.querySelector('tei-abbr'))
        return spanabbr;
      }


    },
    "correspDesc": function(e) {
      let sender = e.querySelector('tei-correspAction[type="sent"]>tei-persName');
      let recipient = e.querySelector('tei-correspAction[type="received"]>tei-persName');
      let dateSent = e.querySelector('tei-correspAction[type="sent"]>tei-date').getAttribute("when");
      let placeSent = e.querySelector('tei-correspAction[type="sent"]>tei-settlement');
      let placeReceived = e.querySelector('tei-correspAction[type="received"]>tei-settlement');


      // document.getElementById('data-sender').appendChild(sender);
      // document.getElementById('data-recipient').appendChild(recipient);
      // document.getElementById('data-dateSent').innerHTML = dateSent;
      // document.getElementById('data-placeSent').appendChild(placeSent);
      // document.getElementById('data-placeReceived').appendChild(placeReceived );
    },

  }
};
c.addBehaviors(behaviors);
