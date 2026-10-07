from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable, Flowable, NextPageTemplate
)
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "downloads" / "Lame_Brain_Ideas_Prospectus.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = letter
INK = colors.HexColor("#13212B")
PAPER = colors.HexColor("#F6F3E9")
ACID = colors.HexColor("#F4EE45")
TEAL = colors.HexColor("#007C83")
ORANGE = colors.HexColor("#EF6136")
MINT = colors.HexColor("#B7EAD1")
BLUE = colors.HexColor("#DCE9F1")
WHITE = colors.white
MUTED = colors.HexColor("#5E676D")
LINE = colors.HexColor("#CBD2D6")
RED = colors.HexColor("#B42318")

FONT_REG = "Helvetica"
FONT_BOLD = "Helvetica-Bold"
FONT_ITALIC = "Helvetica-Oblique"
for candidate, name in [
    ("/System/Library/Fonts/Supplemental/Arial.ttf", "LBI-Regular"),
    ("/System/Library/Fonts/Supplemental/Arial Bold.ttf", "LBI-Bold"),
    ("/System/Library/Fonts/Supplemental/Georgia Italic.ttf", "LBI-Italic"),
]:
    try:
        if Path(candidate).exists():
            pdfmetrics.registerFont(TTFont(name, candidate))
    except Exception:
        pass
if "LBI-Regular" in pdfmetrics.getRegisteredFontNames(): FONT_REG = "LBI-Regular"
if "LBI-Bold" in pdfmetrics.getRegisteredFontNames(): FONT_BOLD = "LBI-Bold"
if "LBI-Italic" in pdfmetrics.getRegisteredFontNames(): FONT_ITALIC = "LBI-Italic"

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Kicker", fontName=FONT_BOLD, fontSize=8.5, leading=11, textColor=TEAL, spaceAfter=9, uppercase=True, letterSpacing=1.2))
styles.add(ParagraphStyle(name="H1x", fontName=FONT_BOLD, fontSize=39, leading=39, textColor=INK, spaceAfter=18))
styles.add(ParagraphStyle(name="H2x", fontName=FONT_BOLD, fontSize=24, leading=26, textColor=INK, spaceAfter=12))
styles.add(ParagraphStyle(name="H3x", fontName=FONT_BOLD, fontSize=12.5, leading=15, textColor=INK, spaceAfter=5))
styles.add(ParagraphStyle(name="Bodyx", fontName=FONT_REG, fontSize=9.4, leading=13.2, textColor=INK, spaceAfter=8))
styles.add(ParagraphStyle(name="BodySmall", fontName=FONT_REG, fontSize=7.8, leading=10.5, textColor=MUTED, spaceAfter=5))
styles.add(ParagraphStyle(name="BodyWhite", fontName=FONT_REG, fontSize=9.2, leading=13, textColor=WHITE, spaceAfter=6))
styles.add(ParagraphStyle(name="BigNumber", fontName=FONT_BOLD, fontSize=23, leading=25, textColor=INK, spaceAfter=3))
styles.add(ParagraphStyle(name="MetricLabel", fontName=FONT_BOLD, fontSize=7.2, leading=9, textColor=MUTED, uppercase=True, letterSpacing=.5))
styles.add(ParagraphStyle(name="Quote", fontName=FONT_ITALIC, fontSize=20, leading=25, textColor=INK, leftIndent=18, rightIndent=18, spaceAfter=15))
styles.add(ParagraphStyle(name="Source", fontName=FONT_REG, fontSize=6.5, leading=8.5, textColor=MUTED, spaceAfter=2))
styles.add(ParagraphStyle(name="TableHead", fontName=FONT_BOLD, fontSize=7.2, leading=9, textColor=WHITE))
styles.add(ParagraphStyle(name="TableCell", fontName=FONT_REG, fontSize=7.3, leading=9.5, textColor=INK))
styles.add(ParagraphStyle(name="TableCellBold", fontName=FONT_BOLD, fontSize=7.3, leading=9.5, textColor=INK))

def P(text, style="Bodyx"):
    return Paragraph(text, styles[style])

def footer(c: canvas.Canvas, doc):
    c.saveState()
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setStrokeColor(LINE); c.setLineWidth(.4); c.line(.55*inch, .42*inch, W-.55*inch, .42*inch)
    c.setFillColor(MUTED); c.setFont(FONT_REG, 6.5)
    c.drawString(.55*inch, .25*inch, "LAME BRAIN ideas  /  PUBLIC LAUNCH BRIEF  /  7 OCTOBER 2026")
    c.drawRightString(W-.55*inch, .25*inch, str(doc.page))
    c.restoreState()

def cover(c: canvas.Canvas, doc):
    c.saveState(); c.setFillColor(ACID); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setStrokeColor(colors.Color(0.07,0.13,0.17,alpha=.13)); c.setLineWidth(.35)
    for x in range(0, int(W)+1, 36): c.line(x, 0, x, H)
    for y in range(0, int(H)+1, 36): c.line(0, y, W, y)
    c.setFillColor(INK); c.setFont(FONT_BOLD, 16); c.drawString(.65*inch, H-.65*inch, "LAME BRAIN")
    c.setFont(FONT_ITALIC, 14); c.drawString(1.92*inch, H-.65*inch, "ideas")
    c.setFont(FONT_BOLD, 7.5); c.drawRightString(W-.65*inch, H-.63*inch, "PUBLIC LAUNCH BRIEF / 2026")
    c.setFont(FONT_BOLD, 49); c.drawString(.65*inch, H-2.05*inch, "BRING THE")
    c.setFont(FONT_ITALIC, 51); c.drawString(.65*inch, H-2.7*inch, "rough version.")
    c.setFont(FONT_REG, 14); c.drawString(.68*inch, H-3.25*inch, "A human-guided studio for ideas that need")
    c.drawString(.68*inch, H-3.52*inch, "evidence, decisions, and a useful next move.")
    cx, cy = W-1.75*inch, H-4.85*inch
    c.setStrokeColor(INK); c.setLineWidth(1.4); c.circle(cx,cy,.78*inch,stroke=1,fill=0); c.line(cx-1.02*inch,cy,cx+1.02*inch,cy); c.line(cx,cy-.98*inch,cx,cy+.98*inch)
    c.setFillColor(INK); c.circle(cx,cy,.45*inch,stroke=0,fill=1); c.setFillColor(ACID); c.setFont(FONT_ITALIC, 46); c.drawCentredString(cx,cy-.19*inch,"?")
    c.setFillColor(INK); c.setFont(FONT_BOLD, 8); c.drawString(.68*inch, .95*inch, "FOUNDING PILOT")
    c.setFont(FONT_REG, 8); c.drawString(.68*inch, .72*inch, "Portable studio + partner programs + public learning")
    c.drawRightString(W-.68*inch, .72*inch, "Management case / not an investment offer")
    c.restoreState()

def page_mark(c: canvas.Canvas, doc):
    footer(c, doc)
    c.saveState(); c.setFillColor(TEAL); c.rect(.55*inch,H-.47*inch,.19*inch,.07*inch,fill=1,stroke=0); c.restoreState()

doc = BaseDocTemplate(str(OUT), pagesize=letter, rightMargin=.55*inch, leftMargin=.55*inch, topMargin=.62*inch, bottomMargin=.55*inch, title="Lame Brain Ideas — Public Launch Brief", author="Lame Brain Ideas")
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="Cover", frames=[frame], onPage=cover), PageTemplate(id="Body", frames=[frame], onPage=page_mark)])

def table(data, widths, header=True, font=7.3, padd=6):
    t = Table(data, colWidths=widths, repeatRows=1 if header else 0, hAlign="LEFT")
    ts = [
        ("VALIGN",(0,0),(-1,-1),"TOP"), ("LEFTPADDING",(0,0),(-1,-1),padd), ("RIGHTPADDING",(0,0),(-1,-1),padd),
        ("TOPPADDING",(0,0),(-1,-1),padd), ("BOTTOMPADDING",(0,0),(-1,-1),padd),
        ("GRID",(0,0),(-1,-1),.35,LINE),
    ]
    if header:
        ts += [("BACKGROUND",(0,0),(-1,0),INK), ("TEXTCOLOR",(0,0),(-1,0),WHITE)]
    for r in range(1 if header else 0, len(data)):
        if r % 2 == 0: ts.append(("BACKGROUND",(0,r),(-1,r),colors.HexColor("#EEF2F3")))
    t.setStyle(TableStyle(ts)); return t

def metrics(items, bg=BLUE):
    cells=[]
    for number,label,note in items:
        cells.append([P(number,"BigNumber"),P(label,"MetricLabel"),P(note,"BodySmall")])
    t=Table([cells],colWidths=[doc.width/len(cells)]*len(cells),hAlign="LEFT")
    t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),bg),("BOX",(0,0),(-1,-1),.5,INK),("INNERGRID",(0,0),(-1,-1),.5,INK),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),10),("RIGHTPADDING",(0,0),(-1,-1),10),("TOPPADDING",(0,0),(-1,-1),11),("BOTTOMPADDING",(0,0),(-1,-1),9)]));return t

story=[]
story += [Spacer(1, doc.height - 2), NextPageTemplate("Body"), PageBreak()]

story += [P("01 / THE COMPANY DECISION","Kicker"),P("Launch a studio.<br/>Not a monument.","H1x"),P("Lame Brain Ideas should launch as a portable, partner-hosted and digital idea studio. The company earns the right to add fixed cost by proving paid demand, useful outcomes, contribution, and trust controls.","Quote"),metrics([
    ("$125K","90-day authorization ceiling","Released in evidence-based tranches."),
    ("$226K","24-month funding need","Management case with $25K buffer."),
    ("Month 19","first positive monthly EBITDA","A testable forecast, not a promise."),
],MINT),Spacer(1,16),table([
    [P("GO NOW","TableHead"),P("GATE FOR LATER","TableHead")],
    [P("Four paid founding offers; partner-hosted clinics; an eight-episode public-learning season; privacy, evidence, and accessibility controls; a 24-month monthly model.","TableCell"),P("Permanent flagship; owned crowdfunding marketplace; investor network; securities activity; equity compensation; franchising; national paid-media scale.","TableCell")]
],[doc.width/2]*2),Spacer(1,12),P("Why: the category is memorable and the need is plausible, but there is still no primary proof of paid demand, acquisition cost, delivery time, brand acceptance, or repeatable customer outcomes. The pilot exists to produce that evidence.","Bodyx"),PageBreak()]

story += [P("02 / THE WEDGE","Kicker"),P("A fair hearing<br/>for a rough idea.","H1x"),P("Self-service AI makes drafts abundant. It does not automatically choose the right decision, assess evidence, integrate specialist judgment, manage risk, or finish the work. Lame Brain Ideas is designed for that gap.","Bodyx"),Spacer(1,8),table([
    [P("WHO","TableHead"),P("URGENT JOB","TableHead"),P("BEST START","TableHead")],
    [P("First-time or non-technical builder","TableCellBold"),P("Turn a rough possibility into a responsible test.","TableCell"),P("Quick Diagnostic / Idea Sprint","TableCell")],
    [P("Existing small-business owner","TableCellBold"),P("Decide whether and how to launch a new offer, channel, or location.","TableCell"),P("Idea Sprint / Venture Build","TableCell")],
    [P("Community or economic-development host","TableCellBold"),P("Give participants a structured program and measurable outcomes.","TableCell"),P("Partner Workshop","TableCell")],
    [P("Creator or maker","TableCellBold"),P("Package and test a project without pretending to provide regulated advice.","TableCell"),P("Idea Sprint / Venture Build","TableCell")],
],[1.55*inch,3.15*inch,1.7*inch]),Spacer(1,17),P("Positioning","H3x"),P("For people and organizations with a rough idea, Lame Brain Ideas is a human-guided decision studio that turns uncertainty into evidence, artifacts, and responsible next steps. Unlike a blank AI chat, generic coaching, or a full agency, it combines facilitation, research standards, practical production, and explicit stop/go judgment.","Bodyx"),Spacer(1,10),P("The first obtainable market is constrained by trusted distribution and reviewed delivery hours—not by national market share. The launch should favor one region and specific decisions over broad claims that it can help anyone with anything.","Bodyx"),PageBreak()]

story += [P("03 / FOUNDING OFFERS","Kicker"),P("Buy an outcome,<br/>not a fog.","H1x"),table([
    [P("OFFER","TableHead"),P("PRICE","TableHead"),P("PLANNED HOURS","TableHead"),P("WHAT THE CUSTOMER LEAVES WITH","TableHead")],
    [P("Quick Diagnostic","TableCellBold"),P("$125","TableCell"),P("1.25","TableCell"),P("A framed problem, risk map, and next responsible step.","TableCell")],
    [P("Idea Sprint","TableCellBold"),P("$750","TableCell"),P("4","TableCell"),P("Customer, offer, evidence plan, and first-pass economics.","TableCell")],
    [P("Venture Build","TableCellBold"),P("$4,200","TableCell"),P("22","TableCell"),P("Research, operating plan, financial model, and launch brief.","TableCell")],
    [P("Partner Workshop","TableCellBold"),P("$2,500","TableCell"),P("10","TableCell"),P("A facilitated cohort, participant tools, and an outcomes report.","TableCell")],
],[1.35*inch,.75*inch,.8*inch,3.5*inch]),Spacer(1,18),metrics([
    ("$1,719","weighted service revenue","At the modeled offer mix."),
    ("8.71 h","weighted delivery time","Must be replaced by time logs."),
    ("58.8%","Month 24 contribution margin","Depends on unproven mix and costs."),
],BLUE),Spacer(1,17),P("Offer rules","H3x"),P("Every engagement names one decision, intended user, artifact, exclusions, price, revision allowance, data boundary, and stop condition. Specialist work is quoted separately or referred. Discounts are attributed to acquisition or sponsorship rather than hidden inside realized price.","Bodyx"),P("Membership begins no earlier than Month 13 and only after paid continuation demand. Media sponsorship begins no earlier than Month 18 and only after audience quality and editorial independence are documented.","Bodyx"),PageBreak()]

story += [P("04 / THE METHOD","Kicker"),P("Make the uncertainty<br/>visible.","H1x"),table([
    [P("STEP","TableHead"),P("WORK","TableHead"),P("CONTROL","TableHead")],
    [P("01 / Frame","TableCellBold"),P("Define the decision, affected people, deadline, constraints, and success.","TableCell"),P("One-page decision frame","TableCell")],
    [P("02 / Research","TableCellBold"),P("Gather current sources and separate facts, estimates, assumptions, and unknowns.","TableCell"),P("Claim-level evidence register","TableCell")],
    [P("03 / Build","TableCellBold"),P("Create the smallest artifact that can move the decision forward.","TableCell"),P("Scope, ownership, accessibility","TableCell")],
    [P("04 / Test","TableCellBold"),P("Put the idea in front of real people and measure behavior.","TableCell"),P("Consent, attribution, actuals","TableCell")],
    [P("05 / Decide","TableCellBold"),P("Proceed, revise, pause, refer, or stop—with a reason.","TableCell"),P("Named human owner","TableCell")],
],[1.05*inch,3.65*inch,1.7*inch]),Spacer(1,18),P("What quality means","H3x"),P("A useful deliverable answers four questions: What decision is this for? What is fact, estimate, assumption, target, or unknown? What evidence would change the recommendation? Who is accountable for the final judgment?", "Bodyx"),Spacer(1,10),P("Service boundary","H3x"),P("The studio does not provide legal, tax, medical, investment, engineering certification, or patentability opinions. It does not guarantee funding, IP protection, commercial success, media reach, or investor interest. Work stops or refers when those judgments are central.","Bodyx"),PageBreak()]

story += [P("05 / FIRST 90 DAYS","Kicker"),P("Prove the operating<br/>thesis.","H1x"),table([
    [P("WINDOW","TableHead"),P("BUILD","TableHead"),P("RELEASE GATE","TableHead")],
    [P("Days 0–30","TableCellBold"),P("Entity, agreements, insurance, payments, approved tools, brand/name decision, three hosts, two internal case simulations, first two media pieces.","TableCell"),P("Controls approved; credible recruitment path; no material brand or insurance blocker.","TableCell")],
    [P("Days 31–60","TableCellBold"),P("Sell and deliver paid cases; log channel, price, hours, cost, rework, refund, outcome, and follow-through; publish two more episodes.","TableCell"),P("Six paid cases; complete delivery economics; acceptable outcomes; no material trust incident.","TableCell")],
    [P("Days 61–90","TableCellBold"),P("Reach or explain the 12-case target; finish eight episodes; replace model inputs with actuals; select one segment and two offers.","TableCell"),P("Written repeat, narrow, redesign, pause, or stop decision.","TableCell")],
],[1.05*inch,3.25*inch,2.1*inch]),Spacer(1,18),metrics([
    ("3","host partners by Day 30","Trusted local distribution."),
    ("12","paid cases by Month 3","First commercial proof gate."),
    ("8","published episodes","Cadence and qualified actions."),
    ("85%","utilization ceiling","Protects review and quality."),
],MINT),Spacer(1,18),P("The model currently produces about 11 paid cases in Months 1–3, slightly below the 12-case target. That gap is useful: the gate should challenge the management case, not automatically approve it.","Bodyx"),PageBreak()]

revenues=[6016,6557,7147,7790,8492,9256,12268,13372,14576,15887,17317,18876,23146,24763,26462,28247,30123,33096,35505,38023,40656,43411,46295,49317]
ebitda=[-7946,-7644,-7315,-11557,-11166,-10740,-9060,-8445,-7774,-7043,-6245,-5377,-6973,-6015,-5012,-3961,-2859,-883,604,2151,3762,5442,7193,9021]
class MiniChart(Flowable):
    def __init__(self):
        super().__init__(); self.width=doc.width; self.height=220
    def draw(self):
        c=self.canv; c.saveState(); cw=doc.width; left=36; base=30; plotw=cw-52; ploth=150
        c.setStrokeColor(LINE); c.setLineWidth(.4)
        for j in range(5):
            yy=base+j*ploth/4; c.line(left,yy,left+plotw,yy)
        mn=-12000; mx=50000
        def py(v): return base+(v-mn)/(mx-mn)*ploth
        for vals,col in [(revenues,TEAL),(ebitda,ORANGE)]:
            c.setStrokeColor(col); c.setLineWidth(2); pts=[]
            for i,v in enumerate(vals): pts.append((left+i*plotw/23,py(v)))
            for a,b in zip(pts,pts[1:]): c.line(a[0],a[1],b[0],b[1])
        c.setFillColor(INK); c.setFont(FONT_BOLD,7); c.drawString(left,base+ploth+12,"MONTHLY REVENUE"); c.setFillColor(TEAL); c.rect(left+83,base+ploth+13,15,2,fill=1,stroke=0)
        c.setFillColor(INK); c.drawString(left+115,base+ploth+12,"EBITDA"); c.setFillColor(ORANGE); c.rect(left+152,base+ploth+13,15,2,fill=1,stroke=0)
        c.setFillColor(MUTED); c.setFont(FONT_REG,6.5); c.drawString(left,base-12,"NOV 2026"); c.drawCentredString(left+plotw/2,base-12,"NOV 2027"); c.drawRightString(left+plotw,base-12,"OCT 2028")
        c.restoreState()

story += [P("06 / FINANCIAL FEASIBILITY","Kicker"),P("Fund the learning.<br/>Protect the option.","H1x"),metrics([
    ("$75K","prelaunch uses","Professional setup + portable capacity."),
    ("$556.6K","24-month revenue","Management case; not audited."),
    ("$49.3K","Month 24 revenue","With 83.5% delivery utilization."),
    ("$9.0K","Month 24 EBITDA","First turns positive in Month 19."),
],BLUE),Spacer(1,10),MiniChart(),Spacer(1,5),P("Model interpretation","H3x"),P("The company absorbs losses while qualified lead volume, booking, paid conversion, offer mix, membership, and sponsorship mature. It requires approximately $226,014 of external funding to maintain a $25,000 minimum cash buffer. The model contains no storefront lease, crowdfunding fees, investor memberships, transaction compensation, or equity revenue.","Bodyx"),P("Capital is authorized in tranches: $35,000 for trust and setup, $65,000 for the paid pilot, and a $25,000 completion buffer. Each tranche has evidence requirements and stop conditions.","Bodyx"),PageBreak()]

story += [P("07 / DISTRIBUTION + MEDIA","Kicker"),P("Build trust<br/>in public.","H1x"),table([
    [P("CHANNEL","TableHead"),P("FOUNDING TEST","TableHead"),P("SUCCESS SIGNAL","TableHead")],
    [P("Trusted hosts","TableCellBold"),P("Libraries, maker spaces, universities, SBDCs, chambers, coworking spaces, professional firms.","TableCell"),P("Attributed paid cases and repeat host demand.","TableCell")],
    [P("Referrals","TableCellBold"),P("Ask after a documented outcome; build a vetted specialist bench.","TableCell"),P("Qualified introduction, follow-on work, or appropriate referral.","TableCell")],
    [P("Public learning","TableCellBold"),P("Eight audio/video episodes: Idea Clinics, Builder Stories, Evidence Reviews, Field Notes.","TableCell"),P("Submitted decisions, hosts, expert corrections, bookings, and paid cases.","TableCell")],
    [P("Targeted outreach","TableCellBold"),P("Small lists and partner-specific invitations; no national paid-media scale.","TableCell"),P("Message/channel combination that converts at a measurable cost.","TableCell")],
],[1.2*inch,3.45*inch,1.75*inch]),Spacer(1,18),P("Editorial compact","H3x"),P("Media proves the method; it does not appropriate customer work. Paid service and media participation are separate choices. Every episode includes a transcript, captions, show notes, source links, disclosure, consent record, and one qualified next action. Sponsors receive no control over conclusions or corrections.","Bodyx"),Spacer(1,12),P("Evidence supports testing dual-format media: Edison Research reports 58% monthly U.S. podcast consumption among people age 12+ and 57% having consumed podcasts in both audio and video formats. Those national figures justify a channel experiment, not an audience forecast.","Bodyx"),PageBreak()]

story += [P("08 / TRUST + GOVERNANCE","Kicker"),P("Human responsibility.<br/>Visible boundaries.","H1x"),table([
    [P("COMMITMENT","TableHead"),P("OPERATING CONTROL","TableHead")],
    [P("Data restraint","TableCellBold"),P("Public intake asks only for contact, starting point, and a one-sentence goal. Confidential handling terms come before sensitive work.","TableCell")],
    [P("Responsible AI","TableCellBold"),P("Approved tools, engagement-specific data rules, traceable evidence, recorded human review, and no automated high-risk decisions.","TableCell")],
    [P("Research integrity","TableCellBold"),P("Facts, calculations, management assumptions, pilot targets, policies, and unknowns remain distinct.","TableCell")],
    [P("Separate consent","TableCellBold"),P("Paid service never requires public exposure. Media use has specific scope and revocation terms.","TableCell")],
    [P("Accessibility","TableCellBold"),P("Keyboard, focus, contrast, reflow, reduced motion, transcripts/captions, and alternative-format review.","TableCell")],
    [P("Corrections","TableCellBold"),P("Material errors are dated and propagated to related public artifacts and active media notes.","TableCell")],
],[1.55*inch,4.85*inch]),Spacer(1,18),P("Named human decision rights","H3x"),P("The Founder / General Manager owns strategy and capital. Delivery owns scope and outcomes. Research & Integrity owns claims and corrections. Trust & Operations owns tools, data, retention, and incidents. Editorial owns consented public work. Finance owns actuals and cash. AI and automated agents may assist; they never own a decision.","Bodyx"),P("Current U.S. guidance also matters: the Copyright Office centers sufficient human expressive contribution in AI-assisted work, and the USPTO states that only natural persons may be named as inventors. Specialist counsel must apply those principles to an actual project.","Bodyx"),PageBreak()]

story += [P("09 / EVIDENCE STATUS","Kicker"),P("Large context.<br/>Unproven purchase.","H1x"),table([
    [P("CLAIM","TableHead"),P("STATUS","TableHead"),P("DECISION USE","TableHead")],
    [P("36.2M U.S. small businesses; 62.3M employees; 43.5% of GDP","TableCellBold"),P("Sourced","TableCell"),P("Economic context, not a customer count.","TableCell")],
    [P("531,728 Aug. 2026 business applications; 28,501 projected formations","TableCellBold"),P("Sourced","TableCell"),P("Continuing formation activity, not willingness to pay.","TableCell")],
    [P("$125–$4,200 founding offer prices","TableCellBold"),P("Unproven","TableCell"),P("Replace with transactions and loss reasons.","TableCell")],
    [P("50%+ contribution is attainable","TableCellBold"),P("Modeled","TableCell"),P("Replace with invoices, time, cost, rework, and refunds.","TableCell")],
    [P("The name is welcoming and protectable","TableCellBold"),P("Unknown","TableCell"),P("Moderated audience testing and trademark clearance.","TableCell")],
    [P("Membership and sponsorship can extend the model","TableCellBold"),P("Gated","TableCell"),P("Test only after continuation and audience-quality evidence.","TableCell")],
],[3.25*inch,1.0*inch,2.15*inch]),Spacer(1,18),P("Primary research that changes the plan","H3x"),P("Complete 30 decision interviews and 10 host interviews; run moderated name tests; close 12 paid cases across at least two offers; record time, cost, rework, refund, action, and 14-day follow-through; attribute every lead; finish three host experiments and eight media pieces. Proceed only if one segment and two offers show a credible path to repeatable acquisition, useful outcomes, and contribution below the 85% utilization ceiling.","Bodyx"),PageBreak()]

story += [P("10 / 24-MONTH ROADMAP","Kicker"),P("Earn the right<br/>to expand.","H1x"),table([
    [P("PERIOD","TableHead"),P("COMPANY WORK","TableHead"),P("NOT YET","TableHead")],
    [P("Months 1–3","TableCellBold"),P("Form, protect, recruit, sell, deliver, measure, publish, and make the first stop/go decision.","TableCell"),P("Lease, regulated revenue, mass acquisition.","TableCell")],
    [P("Months 4–12","TableCellBold"),P("Keep one segment and two offers; standardize quality; grow to 6–10 regional hosts; publish monthly evidence notes.","TableCell"),P("Membership without demand; permanent site without a quantified constraint.","TableCell")],
    [P("Months 13–24","TableCellBold"),P("Test one paid continuity cohort; expand repeat partner programs; test sponsors after audience-quality controls.","TableCell"),P("National platform or franchise without one repeatable local system.","TableCell")],
],[1.15*inch,3.55*inch,1.7*inch]),Spacer(1,18),P("Principal risks","H3x"),table([
    [P("RISK","TableHead"),P("EARLY WARNING","TableHead"),P("RESPONSE","TableHead")],
    [P("Curiosity does not convert","TableCellBold"),P("High interest, low payment","TableCell"),P("Narrow the customer and outcome; stop broad awareness spend.","TableCell")],
    [P("Scope becomes unbounded","TableCellBold"),P("Hours and rework exceed plan","TableCell"),P("Tighten intake, change control, exclusions, and referrals.","TableCell")],
    [P("Brand repels intended users","TableCellBold"),P("Ableist or insulting interpretation","TableCell"),P("Rename before material spend.","TableCell")],
    [P("Growth outruns review","TableCellBold"),P("Utilization >85%; missed QA","TableCell"),P("Waitlist, raise price, add reviewed capacity, or reduce scope.","TableCell")],
    [P("Founder concentration","TableCellBold"),P("Decisions and relationships bottleneck","TableCell"),P("Document playbooks, delegate roles, and build succession coverage.","TableCell")],
],[1.7*inch,1.75*inch,2.95*inch]),PageBreak()]

story += [P("11 / SOURCES + NEXT MOVE","Kicker"),P("The plan changes<br/>when evidence does.","H1x"),P("Primary sources","H3x"),P("1. U.S. SBA Office of Advocacy, <i>Frequently Asked Questions About Small Business 2026</i> — advocacy.sba.gov/wp-content/uploads/2026/02/FINAL_FAQsAboutSmallBusiness_2026_012826.pdf","Source"),P("2. U.S. Census Bureau, <i>Business Formation Statistics</i>, August 2026 — census.gov/econ/bfs/current/index.html","Source"),P("3. U.S. Bureau of Labor Statistics, <i>Management Analysts</i> and <i>Market Research Analysts</i>, May 2025 — bls.gov/ooh/business-and-financial/","Source"),P("4. U.S. SEC, <i>Regulation Crowdfunding Offerings</i>, through June 30, 2026 — sec.gov/data-research/statistics-data-visualizations/regulation-crowdfunding-cf-offerings","Source"),P("5. NIST, <i>AI Risk Management Framework</i> — nist.gov/itl/ai-risk-management-framework","Source"),P("6. U.S. Copyright Office, <i>Copyright and Artificial Intelligence, Part 2: Copyrightability</i>, January 2025 — copyright.gov/ai/","Source"),P("7. USPTO, <i>Revised inventorship guidance for AI-assisted inventions</i>, November 2025 — uspto.gov/subscription-center/2025/revised-inventorship-guidance-ai-assisted-inventions","Source"),P("8. Edison Research, <i>The Infinite Dial 2026</i> — edisonresearch.com/the-infinite-dial-2026/","Source"),P("9. OpenAI, <i>Models</i> — developers.openai.com/api/docs/models","Source"),Spacer(1,16),HRFlowable(width="100%",thickness=1,color=INK),Spacer(1,16),P("Next move","H3x"),P("Close the human launch blockers: form the entity, clear the name, approve agreements and data handling, bind insurance, activate business banking/payments and public email, complete accessibility tests, sign three hosts, and fund the first controlled tranche. Then begin the 90-day pilot and let paid behavior—not enthusiasm—decide what the company becomes.","Bodyx"),Spacer(1,12),P("Request a pilot or host conversation: <b>hello@lamebrainideas.com</b><br/>Public evidence, policies, model, and updates are available from the company website.","Bodyx"),Spacer(1,18),P("This brief is planning information. It is not audited financial reporting, a valuation, legal or tax advice, or an offer to sell securities. Commercial inputs and future results are uncertain. October 2026.","BodySmall")]

doc.build(story)
print(OUT)
