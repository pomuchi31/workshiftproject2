let calendar;

document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'local',
        timeZone: 'local',
        eventDisplay: 'block',
        displayEventTime: false,
        selectable: true,
        select: arg => {
            console.log("Calendar selected", arg);
            initEditModal(arg);
        },
        eventClick: arg => {
            console.log("Event clicked", arg);
            initEditModal(arg);
        },
    });

    calendar.render();

    const initEditModal = data => {
        removeAlreadyModal();
        const defModal = document.getElementById('exampleModal');
        defModal.classList.add('modal-centered');
        const bootstrapModal = new bootstrap.Modal(defModal);
        bootstrapModal.show();
        document.body.appendChild(defModal);
        if (data.event === undefined) {
            const deleteElem = document.querySelector('#defModal .delete');
            if (deleteElem) {
                deleteElem.remove();
            }
        }
        setupModalData(defModal, data);
        registerEditModalEvent(defModal, data);
    };

    const setupModalPosition = (modal, e) => {
        const position = calcModalPosition(e);
        modal.style.left = `${position.x}px`;
        modal.style.top = `${position.y}px`;
    };

  const calcModalPosition = e => {
    const windowWidth = window.outerWidth;

    const y = e.pageY + 16;
    let x = e.pageX;

    if (e.pageX <= 125) {
      x = e.pageX;
    } else if (e.pageX > 125 && windowWidth - e.pageX > 125) {
      x = e.pageX - 125;
    } else if (windowWidth - e.pageX <= 125) {
      x = e.pageX - 250;
    }

    return {
      x: x,
      y: y
    };
  };

  const removeAlreadyModal = () => {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.remove();
    }
  };

  // モーダル登録処理
  const registerEditModalEvent = (modal, arg) => {
    const start = modal.querySelector('#start');
    const end = modal.querySelector('#end');
    const title = modal.querySelector('#title');
    const color = modal.querySelector('#color');

    // 保存
    const saveButton = modal.querySelector('#save');
    if (saveButton) {
      saveButton.addEventListener('click', e => {
        e.preventDefault();


        if (arg.event !== undefined) {
          // 変更時
          const endStrings = end.value && start.value !== end.value ? end.value.split('-') : start.value.split('-');
          const endDate = new Date(endStrings[0], parseInt(endStrings[1]) - 1, endStrings[2], 23, 59, 59);

          arg.event.setStart(start.value);
          arg.event.setEnd(endDate);
          arg.event.setProp('title', title.value);
          arg.event.setProp('backgroundColor', color.value);
        } else {
          // 新規作成時
          const endStrings = end.value && start.value !== end.value ? end.value.split('-') : start.value.split('-');
          const endDate = new Date(endStrings[0], parseInt(endStrings[1]) - 1, endStrings[2], 23, 59, 59);
          calendar.addEvent({
            start: start.value,
            end: endDate,
            title: title.value,
            backgroundColor: color.value
          });
        }

        calendar.unselect();
        modal.remove();
      });
    }

    // キャンセル
    const cancelButton = modal.querySelector('button[data-bs-dismiss="modal"]');
    cancelButton.addEventListener('click', e => {
      e.preventDefault();

      calendar.unselect();
      modal.remove();
    });

    // 削除
    const deleteButton = modal.querySelector('#delete');
    if (deleteButton) {

      deleteButton.addEventListener('click', e => {
        e.preventDefault();
        arg.event.remove();
        calendar.unselect();
        modal.remove();
      });
    }
  };

  // モダールに既存イベントを設定
  const setupModalData = (modal, data) => {

    console.log("Modal content:", modal);
    console.log("Start element:", modal.querySelector('#start'));

    const start = modal.querySelector('#start');
    const end = modal.querySelector('#end');
    const title = modal.querySelector('#title');
    const color = modal.querySelector('#color');

    console.log(data);
    if (data.event !== undefined) {
      start.value = /T/.test(data.event.startStr) ? data.event.startStr.split('T')[0] : data.event.startStr;
      end.value = /T/.test(data.event.endStr) ? data.event.endStr.split('T')[0] : data.event.endStr;
      title.value = data.event.title;
      color.value = data.event.backgroundColor;
    } else {
      start.value = data.startStr;

      const diffTime = Math.abs(data.end - data.start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (1 < diffDays) {

        const endDate = data.end;
        endDate.setDate(endDate.getDate() - 1);
        end.value = formatDate(endDate);
      }
    }

  };

  // DateObject to YYYY-MM-DD
  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-');
  }})