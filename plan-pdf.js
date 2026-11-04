/* Client-side, privacy-preserving PDF export for FIELDGUIDE training plans. */
(function (root) {
  'use strict';
  const W = 612, H = 792, M = 38, BOTTOM = 48, SCALE = 2;
  const INK = '#1b211b', MUTED = '#59625a', OLIVE = '#4b5b35', PALE = '#f1f4ed', RULE = '#aeb8aa';
  const toText = value => value == null ? '' : String(value);
  const graphemes = value => typeof Intl !== 'undefined' && Intl.Segmenter
    ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value), part => part.segment)
    : Array.from(value);

  function makeDocument(program) {
    if (!program || typeof program !== 'object') throw new Error('There is no program to download.');
    const records = Array.isArray(program.weekRecords) ? program.weekRecords : program.plan?.weeks;
    if (!Array.isArray(records) || !records.length) throw new Error('This saved program has no weekly schedule to download.');
    const canvas = document.createElement('canvas');
    canvas.width = W * SCALE; canvas.height = H * SCALE;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('PDF download is not supported in this browser.');
    ctx.scale(SCALE, SCALE);
    const images = [];
    let pageNumber = 0, y = 0;
    const font = (size, weight = 400) => `${weight} ${size}px Arial, sans-serif`;
    const rect = (x, top, width, height, fill, stroke) => {
      if (fill) { ctx.fillStyle = fill; ctx.fillRect(x, top, width, height); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = .6; ctx.strokeRect(x + .3, top + .3, width - .6, height - .6); }
    };
    const text = (value, x, top, size = 10, weight = 400, color = INK) => {
      ctx.font = font(size, weight); ctx.fillStyle = color; ctx.textBaseline = 'top'; ctx.fillText(toText(value), x, top);
    };
    const wrap = (value, width, size = 10, weight = 400) => {
      ctx.font = font(size, weight);
      const result = [];
      for (const paragraph of toText(value).replace(/\r\n?/g, '\n').split('\n')) {
        if (!paragraph) { result.push(''); continue; }
        let line = '';
        for (const word of paragraph.trim().split(/\s+/)) {
          const candidate = line ? `${line} ${word}` : word;
          if (ctx.measureText(candidate).width <= width) { line = candidate; continue; }
          if (line) { result.push(line); line = ''; }
          if (ctx.measureText(word).width <= width) { line = word; continue; }
          for (const unit of graphemes(word)) {
            if (line && ctx.measureText(line + unit).width > width) { result.push(line); line = unit; }
            else line += unit;
          }
        }
        result.push(line);
      }
      return result;
    };
    function finish() {
      if (!pageNumber) return;
      ctx.strokeStyle = RULE; ctx.beginPath(); ctx.moveTo(M, H - 31); ctx.lineTo(W - M, H - 31); ctx.stroke();
      text('FIELDGUIDE / PERSONAL TRAINING PLAN', M, H - 24, 7, 700, MUTED);
      text(`PAGE ${pageNumber}`, W - M - 42, H - 24, 7, 700, MUTED);
      const base64 = canvas.toDataURL('image/jpeg', .92).split(',')[1];
      const binary = atob(base64), data = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) data[i] = binary.charCodeAt(i);
      images.push(data);
    }
    function page(title, subtitle) {
      finish(); pageNumber++;
      rect(0, 0, W, H, '#ffffff');
      text('FIELDGUIDE  /  PERSONAL TRAINING PLAN', M, 28, 8, 700, OLIVE);
      const titleLines = wrap(title, W - 2 * M, 20, 700);
      titleLines.forEach((line, i) => text(line, M, 52 + i * 25, 20, 700));
      const subtitleTop = 54 + titleLines.length * 25;
      if (subtitle) {
        const lines = wrap(subtitle, W - 2 * M, 9, 400);
        lines.forEach((line, i) => text(line, M, subtitleTop + i * 12, 9, 400, MUTED));
        y = subtitleTop + lines.length * 12 + 15;
      } else y = subtitleTop + 15;
    }
    function ensure(space, title = 'PLAN DETAILS', subtitle = 'Continued') {
      if (y + space > H - BOTTOM) page(title, subtitle);
    }
    function section(label, body, title = 'PLAN DETAILS') {
      const content = wrap(body || 'Not specified', W - 2 * M - 20, 10);
      let index = 0;
      do {
        ensure(46, title, 'Continued');
        const capacity = Math.max(1, Math.floor((H - BOTTOM - y - 30) / 14));
        const chunk = content.slice(index, index + capacity);
        const height = 27 + chunk.length * 14;
        rect(M, y, W - 2 * M, height, PALE);
        text(index ? `${label} (CONTINUED)` : label, M + 10, y + 8, 8, 700, OLIVE);
        chunk.forEach((line, i) => text(line, M + 10, y + 23 + i * 14, 10));
        y += height + 9; index += chunk.length;
        if (index < content.length) page(title, 'Continued');
      } while (index < content.length);
    }
    function tableHeader(labels, widths, title = 'PLAN DETAILS', subtitle = 'Continued') {
      ensure(52, title, subtitle);
      let x = M;
      labels.forEach((label, i) => { rect(x, y, widths[i], 24, OLIVE, '#ffffff'); text(label, x + 7, y + 7, 8, 700, '#ffffff'); x += widths[i]; });
      y += 24;
    }
    function tableRow(cells, widths, labels, title, subtitle) {
      const lines = cells.map((cell, i) => wrap(cell || '', widths[i] - 14, 9));
      let offsets = cells.map(() => 0), continuation = false;
      while (offsets.some((offset, i) => offset < lines[i].length)) {
        if (y + 28 > H - BOTTOM) { page(title, subtitle + ' / CONTINUED'); tableHeader(labels, widths, title, subtitle); continuation = true; }
        const maxLines = Math.max(1, Math.floor((H - BOTTOM - y - 14) / 12));
        const count = Math.min(maxLines, Math.max(...lines.map((column, i) => column.length - offsets[i])));
        const height = Math.max(28, count * 12 + 14);
        let x = M;
        lines.forEach((column, i) => {
          rect(x, y, widths[i], height, i === 0 ? '#f1f3ef' : '#ffffff', RULE);
          const chunk = column.slice(offsets[i], offsets[i] + count);
          if (continuation && i === 0 && !chunk.some(Boolean)) text('CONT.', x + 7, y + 8, 8, 700, MUTED);
          chunk.forEach((line, j) => text(line, x + 7, y + 8 + j * 12, 9, i === 0 ? 700 : 400));
          offsets[i] += chunk.length; x += widths[i];
        });
        y += height;
        if (offsets.some((offset, i) => offset < lines[i].length)) { page(title, subtitle + ' / CONTINUED'); tableHeader(labels, widths, title, subtitle); continuation = true; }
      }
    }
    page('YOUR TRAINING PROGRAM', `${toText(program.pathName)}  |  ${toText(program.route)}  |  ${records.length} weeks`);
    section('YOUR GOAL', program.goal);
    section('YOUR TRAINING PROFILE', `${toText(program.days)} days per week  |  ${toText(program.sessionMinutes || 45)} minutes per session\nFocus: ${toText(program.focus || 'General readiness')}\nEquipment: ${toText(program.equipment || 'Not specified')}`);
    if (program.planRationale || program.plan?.rationale) section('WHY YOUR PLAN IS STRUCTURED THIS WAY', program.planRationale || program.plan.rationale);
    if (program.limits) section('CONSTRAINTS YOU ENTERED', program.limits);
    section('HOW TO USE THIS PLAN', 'Each week contains your assigned sessions, progression, recovery and tissue-capacity work. Review the checkpoints and adjust with a qualified coach. Keep at least one full rest day. This plan is a training draft, not medical clearance or an official selection program.');
    section('SWIM SAFETY', 'Swim at a lifeguarded pool. Do not practice breath-holding or underwater training outside qualified supervision.');
    const scores = Array.isArray(program.scores) ? program.scores : (Array.isArray(program.baseline) ? program.baseline : []);
    if (scores.length) {
      page('YOUR STARTING SCORES', 'The results and targets provided when this program was generated.');
      const labels = ['EVENT', 'START', 'TARGET', 'STATUS'], widths = [210, 86, 126, 114];
      tableHeader(labels, widths, 'YOUR STARTING SCORES', 'Baseline results');
      scores.forEach(score => tableRow([toText(score.label), toText(score.value), toText(score.target), toText(score.status)], widths, labels, 'YOUR STARTING SCORES', 'Baseline results'));
    }
    records.forEach((week, index) => {
      const title = `WEEK ${week.week ?? index + 1} OF ${records.length}`;
      const subtitle = `${toText(week.phase || 'Training phase')}${week.checkpoint ? '  |  CHECKPOINT' : ''}`;
      page(title, subtitle);
      section('WEEKLY FOCUS', week.focus, title);
      section('EFFORT TARGET', week.intensityTarget, title);
      const sessions = Array.isArray(week.sessions) ? week.sessions : [];
      const labels = ['DAY', 'CATEGORY', 'WORKOUT DETAILS'], widths = [82, 126, 328];
      tableHeader(labels, widths, title, subtitle);
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const aliases = {mon:0,monday:0,tue:1,tues:1,tuesday:1,wed:2,weds:2,wednesday:2,thu:3,thur:3,thurs:3,thursday:3,fri:4,friday:4,sat:5,saturday:5,sun:6,sunday:6};
      const assigned = new Map(), extra = [];
      for (const session of sessions) {
        const key = toText(session.day).trim().toLowerCase().replace(/\.$/, '');
        const dayIndex = aliases[key];
        if (dayIndex !== undefined && !assigned.has(dayIndex)) assigned.set(dayIndex, session);
        else extra.push(session);
      }
      const drawSession = (label, session) => {
        if (!session) return tableRow([label, 'REST', 'No session scheduled'], widths, labels, title, subtitle);
        tableRow([label, 'SESSION', [session.name, session.detail, session.progression && `Progression: ${session.progression}`].filter(Boolean).join('\n')], widths, labels, title, subtitle);
        for (const block of (session.blocks || [])) tableRow(['', block.category, block.prescription], widths, labels, title, subtitle);
      };
      if (assigned.size) {
        days.forEach((day, i) => drawSession(day, assigned.get(i)));
        extra.forEach(session => drawSession(toText(session.day) || 'Not specified', session));
      } else {
        sessions.forEach(session => drawSession(toText(session.day) || 'Not specified', session));
        for (let i = sessions.length; i < 7; i++) drawSession('Not specified');
      }
      y += 10;
      section('WEEKLY PROGRESSION / ADJUSTMENT', week.adjustment, title);
      section('RECOVERY AND REST', week.recoveryDose, title);
      section('TENDON AND JOINT CAPACITY', week.tissueDose, title);
      section(week.checkpoint ? 'CHECKPOINT / MILESTONE' : 'WEEKLY MILESTONE', week.milestone, title);
      if (week.endpoint) section('WEEKLY OBJECTIVE', week.endpoint, title);
    });
    finish();
    return images;
  }
  function pdfBlob(images) {
    const chunks = [], offsets = [0]; let position = 0;
    const encode = s => new TextEncoder().encode(s);
    function add(part) { const bytes = typeof part === 'string' ? encode(part) : part; chunks.push(bytes); position += bytes.length; }
    function object(id, content) { offsets[id] = position; add(`${id} 0 obj\n`); content(); add('\nendobj\n'); }
    add('%PDF-1.4\n%FIELDGUIDE\n');
    const count = images.length, pageIds = images.map((_, i) => 3 + i * 3);
    object(1, () => add('<< /Type /Catalog /Pages 2 0 R >>'));
    object(2, () => add(`<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${count} >>`));
    images.forEach((image, i) => {
      const id = pageIds[i], imageId = id + 1, streamId = id + 2;
      object(id, () => add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${streamId} 0 R >>`));
      object(imageId, () => { add(`<< /Type /XObject /Subtype /Image /Width ${W * SCALE} /Height ${H * SCALE} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`); add(image); add('\nendstream'); });
      const stream = `q\n${W} 0 0 ${H} 0 0 cm\n/Im0 Do\nQ\n`;
      object(streamId, () => add(`<< /Length ${encode(stream).length} >>\nstream\n${stream}endstream`));
    });
    const xref = position, last = 2 + count * 3;
    add(`xref\n0 ${last + 1}\n0000000000 65535 f \n`);
    for (let i = 1; i <= last; i++) add(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
    add(`trailer\n<< /Size ${last + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
    return new Blob(chunks, { type: 'application/pdf' });
  }
  async function download(program) {
    const blob = pdfBlob(makeDocument(program));
    const url = URL.createObjectURL(blob), anchor = document.createElement('a');
    const safeKey = toText(program.pathKey || 'program').replace(/[^a-z0-9_-]/gi, '-');
    anchor.href = url; anchor.download = `fieldguide-plan-${safeKey}-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  root.FieldguidePlanPDF = { download, create: program => pdfBlob(makeDocument(program)) };
})(globalThis);
