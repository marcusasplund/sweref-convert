/* eslint-disable no-unused-vars */
import { h } from 'hyperapp'

export const Dialog = ({ actions }) => (
  <dialog oncreate={el => actions.attachDialog(el)}>
    <button
      class='right'
      type='button'
      onclick={e => actions.cancelDialog()}
    >
      x
    </button>
    <h2>info</h2>
    <form
      method='dialog'
    >
      <p>Denna app är till för att snabbt konvertera stora mängder koordinater mellan RT90/SWEREF och WGS84
      Det enklaste är att ladda upp ett .csv-dokument med två kolumner; en x- o en y-kolumn. Om ni vill konvertera från WGS84 så
      bocka i rutan för detta. Välj sedan önskad projektion i select-menyn. Om din ursprungsdata är i ngt SWEREF- eller RT90-format
      så lämna WGS84-rutan omarkerad och välj den projektion som din ursprungsdata är i. Kolummnerna lat, lng i resultatet kommer då att vara
      konverterade till WGS84. Klicka gärna på knappen "visa karta" för att kontrollera så att konverteringen ser ut att ha gått rätt till.
      Om den ser heltokig ut så kan du försöka att byta plats på kolumnerna x o y i din ursprungsdata innan du laddar upp.
      </p>
      <p>Du kan även klistra in data direkt i textfältet, alternativt klistra in en länk i det mindre fältet om du har ett dokument på nån server nånstans. </p>
      <p>
        <b>Exempeldata, så här bör den se ut:</b><br />
        x, y<br />
        6373105, 1316400<br />
        6371176, 1312784<br />
        6371447, 1318751<br />
      </p>
      <p>
        <b>Exempelfil:</b><br />
        <a download='rt90.csv' target='_blank' rel='noopener noreferrer' href='https://pap.as/sweref/rt90.csv'>https://pap.as/sweref/rt90.csv</a>
      </p>
      <p>
        Jag tar tacksamt emot synpunkter o önskemål på appen, t.ex. kan det hända
        att många vill konvertera mellan olika SWEREF o RT90-projektioner, kanske jag lägger till detta senare.
      </p>
      <p>
        Maila mig gärna på <a href='mailto:&#109;&#097;&#114;&#099;&#117;&#115;&#064;&#103;&#114;&#101;&#097;&#116;&#110;&#097;&#109;&#101;&#046;&#115;&#101;'>&#109;&#097;&#114;&#099;&#117;&#115;&#064;&#103;&#114;&#101;&#097;&#116;&#110;&#097;&#109;&#101;&#046;&#115;&#101;</a>
      </p>
      <p>
      Beräkningsalgoritmerna kommer från <a href='http://latlong.mellifica.se'>latlong.mellifica.se</a>{' '}
      där finns lite mer info. Källkoden till denna app hittar ni{' '}
        <a href='https://github.com/marcusasplund/sweref-convert'>här</a>
      </p>
      <button
        type='button'
        onclick={e => actions.cancelDialog()}
      >
        stäng
      </button>
    </form>
  </dialog>
)
