const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

const ICO_UNKNOWN = '0';
const ICO_CONNECTED_INACTIVE = '1';
const ICO_DISCONNECTED_INACTIVE_URI = '2';
const ICO_ABOUT_EXPIRE = '3';
const ICO_DISCONNECTACTIVE = '4';
const ICO_DOWNLOADING = '5';
const ICO_PERMANENT = '6';
const ICO_PROTECTED = '7';
const ICO_UPGRADING = '8';

const TDIface = '<node> \
<interface name="com.intel.cmpc.td.client"> \
    <method name="GetInfo"> \
        <arg direction="out"  type="a{ss}" /> \
        <arg direction="in" type="s" /> \
    </method> \
    <method name="OnMenuItemClick"> \
        <arg direction="in" type="s" /> \
    </method> \
    <method name="GetMenuItemInfo"> \
        <arg direction="in" type="s" /> \
        <arg direction="out" type="a{ss}" /> \
    </method> \
    <signal name="TDInfoChanged"> \
        <arg direction="out" type="a{ss}" /> \
    </signal> \
</interface> \
</node>';

//Create the remote object, based on the correct parh and bus name
const TDProxy = Gio.DBusProxy.makeProxyWrapper(TDIface);

const TDclient = new TDProxy(Gio.DBus.session, 'com.intel.cmpc.td.client','/com/intel/cmpc/td/client');

//Set the delegate to the TDInfoChanged Event
TDclient.connectSignal("TDInfoChanged", TDInfoChanged);

print ("Iniciando TPM Monitor...");

function TDInfoChanged(proxy,sender,msg) {
    if(msg != null) {
	print ("Estado: " + msg[0].id);
	print ("MSG: " + msg[0].message);
	print ("HDR: " + msg[0].header);

	if (msg[0].message.indexOf("2020") !== -1 ) {
	    print ("Certificado aplicado. Apagar el equipo");
	}
    }
}

let loop = new GLib.MainLoop(null, false);
loop.run();
