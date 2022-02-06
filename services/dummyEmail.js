module.exports = `<html>
  <head>
    <title></title>
  </head>
  <body>
    <center>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
      </style>
      <table
        style="font-family: 'Montserrat', sans-serif"
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        align="center"
        valign="top"
      >
        <tbody>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                align="center"
                valign="top"
                bgcolor="#ffffff"
                style="padding: 0 20px !important; max-width: 500px; width: 90%"
              >
                <tbody>
                  <!-- common -->
                  <tr>
                    <td align="center" style="padding: 10px 0 0px 0">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="
                          max-width: 500px;
                          border-bottom: 1px solid #e4e4e4;
                        "
                      >
                        <tbody>
                          <tr>
                            <!-- the line height propertry is used to set the height of the blue box -->
                            <td
                              valign="middle"
                              bgcolor="#739ffe"
                              style="
                                padding: 0px;
                                color: #111111;
                                font-size: 48px;
                                font-weight: 400;
                                line-height: 60px;
                                padding: 15px;
                              "
                            >
                              <a
                                href="http://localhost:3000/"
                                target="_blank"
                                data-saferedirecturl="http://localhost:3000/"
                                style="
                                  font-size: 16px;
                                  color: #333;
                                  font-weight: 400;
                                  text-decoration: none;
                                "
                                >FeedbackLoop</a
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td bgcolor="#ffffff" align="center" style="padding: 0">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="
                          max-width: 500px;
                          border-bottom: 1px solid #e4e4e4;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              bgcolor="#ffffff"
                              align="left"
                              style="
                                padding: 40px 20px 10px;
                                font-size: 32px;
                                font-weight: 400;
                              "
                            >
                              <h1
                                style="
                                  font-style: normal;
                                  font-weight: bold;
                                  font-size: 18px;
                                  color: #3d3d3d;
                                  margin-bottom: 2px;
                                  line-height: 30px;
                                "
                              >
                                {Campaign Name}
                              </h1>
                              <hr
                                style="
                                  width: 30px;
                                  float: left;
                                  height: 1.5px;
                                  background: black;
                                "
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td bgcolor="#ffffff" align="center" style="padding: 0">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        width="100%"
                        style="
                          max-width: 500px;
                          border-bottom: 1px solid #e4e4e4;
                        "
                      >
                        <tbody>
                          <tr>
                            <td
                              bgcolor="#ffffff"
                              align="left"
                              style="
                                padding: 40px 20px 10px;
                                font-size: 32px;
                                font-weight: 400;
                              "
                            >
                              <div
                                style="margin: 20px auto 120px; font-size: 16px"
                                class="div-6"
                              >
                                <form action="">
                                  <!-- Number start -->
                                  <div
                                    style="
                                      border-radius: 5px;
                                      padding: 15px;
                                      margin-bottom: 30px;
                                      border-color: rgba(0, 0, 0, 1);
                                      border-width: 1px;
                                      border-style: solid;
                                    "
                                    class="div-7"
                                  >
                                    <div
                                      style="font-size: 16px; line-height: 20px"
                                      class="div-8"
                                    >
                                      Q1. What is your age ?
                                    </div>
                                    <div style="margin-top: 15px" class="div-9">
                                      <input
                                        style="
                                          width: 100%;
                                          height: 30px;
                                          padding: 5px;
                                          outline: none;
                                        "
                                        type="number"
                                        placeholder="Enter number"
                                      />
                                    </div>
                                  </div>

                                  <!-- Range start -->
                                  <div
                                    style="
                                      border-radius: 5px;
                                      padding: 15px;
                                      margin-bottom: 30px;
                                      border-color: rgba(0, 0, 0, 1);
                                      border-width: 1px;
                                      border-style: solid;
                                    "
                                    class="div-7"
                                  >
                                    <div
                                      style="font-size: 16px; line-height: 20px"
                                      class="div-8"
                                    >
                                      Q2. Select a rating from 1 to 5 ?
                                    </div>
                                    <div style="margin-top: 15px" class="div-9">
                                      <input
                                        style="
                                          width: 100%;
                                          height: 30px;
                                          padding: 5px;
                                          outline: none;
                                          cursor: pointer;
                                        "
                                        type="range"
                                        min="1"
                                        max="5"
                                        step="1"
                                        value="4"
                                      />
                                    </div>
                                  </div>

                                  <!-- checkbox start -->
                                  <div
                                    style="
                                      border-radius: 5px;
                                      padding: 15px;
                                      margin-bottom: 30px;
                                      border-color: rgba(0, 0, 0, 1);
                                      border-width: 1px;
                                      border-style: solid;
                                    "
                                    class="div-7"
                                  >
                                    <div
                                      style="font-size: 16px; line-height: 20px"
                                      class="div-8"
                                    >
                                      Q2.What other products are you interested
                                      in?
                                    </div>
                                    <div
                                      style="
                                        margin-top: 15px;
                                        display: flex;
                                        align-items: center;
                                      "
                                      class="div-9"
                                    >
                                      <input
                                        style="
                                          width: 5%;
                                          height: 18px;
                                          padding: 5px;
                                          cursor: pointer;
                                          margin-right: 10px;
                                        "
                                        type="checkbox"
                                        id="1"
                                      />
                                      <label for="1">Phones</label>
                                    </div>

                                    <div
                                      style="
                                        margin-top: 15px;
                                        display: flex;
                                        align-items: center;
                                      "
                                      class="div-9"
                                    >
                                      <input
                                        style="
                                          width: 5%;
                                          height: 18px;
                                          padding: 5px;
                                          cursor: pointer;
                                          margin-right: 10px;
                                        "
                                        type="checkbox"
                                        id="2"
                                      />
                                      <label for="2">Laptops</label>
                                    </div>

                                    <div
                                      style="
                                        margin-top: 15px;
                                        display: flex;
                                        align-items: center;
                                      "
                                      class="div-9"
                                    >
                                      <input
                                        style="
                                          width: 5%;
                                          height: 18px;
                                          padding: 5px;
                                          cursor: pointer;
                                          margin-right: 10px;
                                        "
                                        type="checkbox"
                                        id="3"
                                      />
                                      <label for="3">Computers</label>
                                    </div>

                                    <div
                                      style="
                                        margin-top: 15px;
                                        display: flex;
                                        align-items: center;
                                      "
                                      class="div-9"
                                    >
                                      <input
                                        style="
                                          width: 5%;
                                          height: 18px;
                                          padding: 5px;
                                          cursor: pointer;
                                          margin-right: 10px;
                                        "
                                        type="checkbox"
                                        id="4"
                                      />
                                      <label for="4">Others</label>
                                    </div>
                                  </div>

                                  <!-- Radio start -->
                                  <div
                                    style="
                                      border-radius: 5px;
                                      padding: 15px;
                                      margin-bottom: 30px;
                                      border-color: rgba(0, 0, 0, 1);
                                      border-width: 1px;
                                      border-style: solid;
                                    "
                                    class="div-7"
                                  >
                                    <div
                                      style="font-size: 16px; line-height: 20px"
                                      class="div-8"
                                    >
                                      Q2.What other products are you interested
                                      in?
                                    </div>
                                    <div
                                      style="
                                        margin-top: 15px;
                                        display: flex;
                                        align-items: center;
                                      "
                                      class="div-9"
                                    >
                                      <input
                                        style="
                                          width: 5%;
                                          height: 18px;
                                          padding: 5px;
                                          cursor: pointer;
                                          margin-right: 10px;
                                        "
                                        type="radio"
                                        name="interested"
                                        id="1"
                                      />
                                      <label for="1">Phones</label>
                                    </div>

                                    <div
                                      style="
                                        margin-top: 15px;
                                        display: flex;
                                        align-items: center;
                                      "
                                      class="div-9"
                                    >
                                      <input
                                        style="
                                          width: 5%;
                                          height: 18px;
                                          padding: 5px;
                                          cursor: pointer;
                                          margin-right: 10px;
                                        "
                                        type="radio"
                                        name="interested"
                                        id="2"
                                      />
                                      <label for="2">Laptops</label>
                                    </div>

                                    <div
                                      style="
                                        margin-top: 15px;
                                        display: flex;
                                        align-items: center;
                                      "
                                      class="div-9"
                                    >
                                      <input
                                        style="
                                          width: 5%;
                                          height: 18px;
                                          padding: 5px;
                                          cursor: pointer;
                                          margin-right: 10px;
                                        "
                                        type="radio"
                                        name="interested"
                                        id="3"
                                      />
                                      <label for="3">Computers</label>
                                    </div>

                                    <div
                                      style="
                                        margin-top: 15px;
                                        display: flex;
                                        align-items: center;
                                      "
                                      class="div-9"
                                    >
                                      <input
                                        style="
                                          width: 5%;
                                          height: 18px;
                                          padding: 5px;
                                          cursor: pointer;
                                          margin-right: 10px;
                                        "
                                        type="radio"
                                        name="interested"
                                        id="4"
                                      />
                                      <label for="4">Others</label>
                                    </div>
                                  </div>

                                  <!-- text start -->
                                  <div
                                    style="
                                      border-radius: 5px;
                                      padding: 15px;
                                      margin-bottom: 30px;
                                      border-color: rgba(0, 0, 0, 1);
                                      border-width: 1px;
                                      border-style: solid;
                                    "
                                    class="div-7"
                                  >
                                    <div
                                      style="font-size: 16px; line-height: 20px"
                                      class="div-8"
                                    >
                                      Q1. Give us a short review ?
                                    </div>
                                    <div style="margin-top: 15px" class="div-9">
                                      <input
                                        style="
                                          width: 100%;
                                          height: 30px;
                                          padding: 5px;
                                          outline: none;
                                        "
                                        placeholder="Enter text"
                                        maxlength="50"
                                        type="text"
                                      />
                                    </div>
                                  </div>

                                  <!-- long text start -->

                                  <!-- <form action="/action_page.php" id="usrform">
                                  Name: <input type="text" name="usrname" />
                                  <input type="submit" />
                                </form>

                                <textarea name="comment" form="usrform">
                                  Enter text here...</textarea
                                > -->

                                  <div
                                    style="
                                      border-radius: 5px;
                                      padding: 15px;
                                      margin-bottom: 30px;
                                      border-color: rgba(0, 0, 0, 1);
                                      border-width: 1px;
                                      border-style: solid;
                                    "
                                    class="div-7"
                                  >
                                    <div
                                      style="font-size: 16px; line-height: 20px"
                                      class="div-8"
                                    >
                                      Q1. Give us a long review ?
                                    </div>
                                    <div style="margin-top: 15px" class="div-9">
                                      <textarea
                                        style="
                                          width: 100%;
                                          padding: 5px;
                                          outline: none;
                                        "
                                        placeholder="Enter text"
                                        cols="50"
                                        rows="10"
                                        maxlength="250"
                                      ></textarea>
                                    </div>
                                  </div>

                                  <!-- Date start -->
                                  <div
                                    style="
                                      border-radius: 5px;
                                      padding: 15px;
                                      margin-bottom: 30px;
                                      border-color: rgba(0, 0, 0, 1);
                                      border-width: 1px;
                                      border-style: solid;
                                    "
                                    class="div-7"
                                  >
                                    <div
                                      style="font-size: 16px; line-height: 20px"
                                      class="div-8"
                                    >
                                      Q1. When did you last search for a
                                      choclate ?
                                    </div>
                                    <div style="margin-top: 15px" class="div-9">
                                      <input
                                        style="
                                          width: 100%;
                                          height: 30px;
                                          padding: 5px;
                                          outline: none;
                                        "
                                        type="date"
                                        min="2020-02-14"
                                        max="2025-8-15"
                                        value="2022-02-28"
                                      />
                                    </div>
                                  </div>

                                  <div
                                    style="
                                      border-radius: 5px;
                                      padding: 15px;
                                      margin-bottom: 30px;
                                      border-color: rgba(0, 0, 0, 1);
                                      border-width: 1px;
                                      border-style: solid;
                                    "
                                    class="div-7"
                                  >
                                    <div
                                      style="font-size: 16px; line-height: 20px"
                                      class="div-8"
                                    >
                                      Q1. From where did you buy a choclate last
                                      time ?
                                    </div>
                                    <div style="margin-top: 15px" class="div-9">
                                      <input
                                        style="
                                          width: 100%;
                                          height: 30px;
                                          padding: 5px;
                                          outline: none;
                                        "
                                        placeholder="http://www.abc.com"
                                        type="url"
                                        maxlength="100"
                                      />
                                    </div>
                                  </div>

                                  <input
                                    style="
                                      display: block;
                                      width: 50%;
                                      padding: 10px 25px;
                                      background-color: #739ffe;
                                      border: none;
                                      margin: 10px auto;
                                      border-radius: 10px;
                                      cursor: pointer;
                                      color: #333;
                                    "
                                    type="Submit"
                                  />
                                </form>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </center>
  </body>
</html>`;
